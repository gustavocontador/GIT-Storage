#!/usr/bin/env bun

/**
 * Bridge OpenClaw <-> Supabase
 *
 * Sincroniza sessoes, mensagens e eventos do OpenClaw com o Supabase PostgreSQL.
 *
 * Uso:
 *   node bridge.js status   — Estado da conexao e ultima sincronizacao
 *   node bridge.js migrate  — Cria/atualiza tabelas no Supabase
 *   node bridge.js sync     — Sincroniza sessoes JSONL pendentes
 *   node bridge.js watch    — Daemon: observa novos JSONL e sincroniza em tempo real
 */

import { readFileSync, readdirSync, existsSync, watch } from "node:fs";
import { join, basename } from "node:path";
import { homedir } from "node:os";

// --- Config ---

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const DATABASE_URL = process.env.DATABASE_URL;

const OPENCLAW_DIR = join(homedir(), ".openclaw");
const SESSIONS_DIR = join(OPENCLAW_DIR, "agents", "main", "sessions");
const EVENTS_LOG = join(OPENCLAW_DIR, "logs", "claude-code-events.jsonl");
const MIGRATIONS_DIR = join(
  process.env.AIOS_ROOT || join(homedir(), "Documents", "AIOS"),
  ".aios-core",
  "infrastructure",
  "migrations"
);

// --- Supabase REST helpers ---

async function supabaseRPC(sql) {
  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query: sql }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase RPC error ${res.status}: ${text}`);
  }
  return res.json();
}

async function supabaseQuery(table, method = "GET", body = null, params = "") {
  const url = `${SUPABASE_URL}/rest/v1/${table}${params ? "?" + params : ""}`;
  const opts = {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: method === "POST" ? "return=representation" : "return=minimal",
    },
  };
  if (body) opts.body = JSON.stringify(body);
  const res = await fetch(url, opts);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase ${method} ${table} error ${res.status}: ${text}`);
  }
  const contentType = res.headers.get("content-type") || "";
  if (contentType.includes("json")) return res.json();
  return null;
}

async function supabaseUpsert(table, data, onConflict) {
  const qs = onConflict ? `?on_conflict=${onConflict}` : "";
  const url = `${SUPABASE_URL}/rest/v1/${table}${qs}`;
  const res = await fetch(url, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Supabase upsert ${table} error ${res.status}: ${text}`);
  }
  return res.json();
}

// --- Migration (via DATABASE_URL + bun:sql) ---

async function runMigrations() {
  console.log("Executando migrations...\n");

  if (!DATABASE_URL) {
    console.error("ERRO: DATABASE_URL nao configurada.");
    console.log("  Dica: export DATABASE_URL=postgresql://...\n");
    process.exit(1);
  }

  if (!existsSync(MIGRATIONS_DIR)) {
    console.error(`Diretorio de migrations nao encontrado: ${MIGRATIONS_DIR}`);
    process.exit(1);
  }

  const files = readdirSync(MIGRATIONS_DIR)
    .filter((f) => f.endsWith(".sql"))
    .sort();

  if (files.length === 0) {
    console.log("Nenhuma migration encontrada.");
    return;
  }

  // Conexao direta via bun:sql
  const { SQL } = await import("bun");
  const db = new SQL({ url: DATABASE_URL });

  for (const file of files) {
    console.log(`  -> ${file}`);
    const sql = readFileSync(join(MIGRATIONS_DIR, file), "utf-8");

    try {
      await db.unsafe(sql);
      console.log(`  -> OK`);
    } catch (err) {
      if (err.message?.includes("already exists")) {
        console.log(`  -> OK (tabelas ja existem)`);
      } else {
        console.error(`  -> ERRO: ${err.message}`);
      }
    }
  }

  await db.close();
  console.log("\nMigrations concluidas.");
}

// --- Parse JSONL session ---

function parseSessionFile(filepath) {
  const lines = readFileSync(filepath, "utf-8")
    .split("\n")
    .filter((l) => l.trim());

  let session = null;
  const messages = [];
  const events = [];

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (entry.type === "session") {
      session = {
        openclaw_session_id: entry.id,
        started_at: entry.timestamp,
        metadata: { version: entry.version, cwd: entry.cwd },
      };
    } else if (entry.type === "model_change") {
      if (session) {
        session.model = entry.modelId;
        session.metadata.provider = entry.provider;
      }
    } else if (entry.type === "message" && entry.message) {
      const msg = entry.message;
      const usage = msg.usage || {};
      messages.push({
        openclaw_message_id: entry.id,
        role: msg.role,
        content: typeof msg.content === "string"
          ? msg.content
          : Array.isArray(msg.content)
            ? msg.content.map((c) => c.text || "").join("\n")
            : JSON.stringify(msg.content),
        timestamp: entry.timestamp,
        token_count: usage.totalTokens || null,
        cost: usage.cost?.total || null,
        model: msg.model || null,
        stop_reason: msg.stopReason || null,
        metadata: {
          parentId: entry.parentId,
          provider: msg.provider,
          api: msg.api,
        },
      });
    } else if (
      entry.type === "thinking_level_change" ||
      entry.type === "custom"
    ) {
      events.push({
        event_type: entry.type === "custom" ? entry.customType || "custom" : entry.type,
        payload: entry.data || { level: entry.thinkingLevel },
        timestamp: entry.timestamp,
      });
    }
  }

  return { session, messages, events };
}

// --- Parse events log ---

function parseEventsLog(filepath, since = null) {
  if (!existsSync(filepath)) return [];

  const lines = readFileSync(filepath, "utf-8")
    .split("\n")
    .filter((l) => l.trim());

  const events = [];
  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    if (since && entry.ts && new Date(entry.ts) <= new Date(since)) continue;

    events.push({
      event_type: entry.event,
      payload: { cwd: entry.cwd, title: entry.title },
      timestamp: entry.ts,
    });
  }

  return events;
}

// --- Sync ---

async function getLastSync(source) {
  try {
    const rows = await supabaseQuery(
      "sync_log",
      "GET",
      null,
      `source=eq.${source}&order=last_synced_at.desc&limit=1`
    );
    return rows?.[0] || null;
  } catch {
    return null;
  }
}

async function recordSync(source, file, count, status = "ok", errorMsg = null) {
  await supabaseQuery("sync_log", "POST", {
    source,
    last_synced_file: file,
    records_synced: count,
    status,
    error_message: errorMsg,
  });
}

async function syncSessionFile(filepath) {
  const filename = basename(filepath);
  const { session, messages, events } = parseSessionFile(filepath);

  if (!session) {
    console.log(`  [skip] ${filename} — sem header de sessao`);
    return 0;
  }

  console.log(
    `  [sync] ${filename} — ${messages.length} msgs, ${events.length} events`
  );

  // Upsert session
  const [sessionRow] = await supabaseUpsert("sessions", {
    openclaw_session_id: session.openclaw_session_id,
    model: session.model,
    cwd: session.metadata?.cwd,
    started_at: session.started_at,
    metadata: session.metadata,
  }, "openclaw_session_id");

  const sessionId = sessionRow.id;
  let count = 1;

  // Insert messages
  if (messages.length > 0) {
    const msgRows = messages.map((m) => ({
      ...m,
      session_id: sessionId,
    }));

    // Batch em grupos de 50
    for (let i = 0; i < msgRows.length; i += 50) {
      const batch = msgRows.slice(i, i + 50);
      await supabaseQuery("messages", "POST", batch);
      count += batch.length;
    }
  }

  // Insert events
  if (events.length > 0) {
    const evtRows = events.map((e) => ({
      ...e,
      session_id: sessionId,
    }));

    for (let i = 0; i < evtRows.length; i += 50) {
      const batch = evtRows.slice(i, i + 50);
      await supabaseQuery("events", "POST", batch);
      count += batch.length;
    }
  }

  return count;
}

async function syncEventsLog() {
  if (!existsSync(EVENTS_LOG)) {
    console.log("  [skip] Arquivo de eventos nao encontrado");
    return 0;
  }

  const lastSync = await getLastSync("events-log");
  const since = lastSync?.last_synced_at || null;

  console.log(
    `  [events] Sincronizando ${EVENTS_LOG}${since ? ` (desde ${since})` : ""}`
  );

  const events = parseEventsLog(EVENTS_LOG, since);
  if (events.length === 0) {
    console.log("  [events] Nenhum evento novo");
    return 0;
  }

  // Batch insert
  for (let i = 0; i < events.length; i += 50) {
    const batch = events.slice(i, i + 50);
    await supabaseQuery("events", "POST", batch);
  }

  await recordSync("events-log", EVENTS_LOG, events.length);
  console.log(`  [events] ${events.length} eventos sincronizados`);
  return events.length;
}

async function syncAllSessions() {
  console.log("Sincronizando sessoes...\n");

  if (!existsSync(SESSIONS_DIR)) {
    console.log(`Diretorio de sessoes nao encontrado: ${SESSIONS_DIR}`);
    return;
  }

  const lastSync = await getLastSync("sessions");
  const lastFile = lastSync?.last_synced_file;

  const files = readdirSync(SESSIONS_DIR)
    .filter((f) => f.endsWith(".jsonl"))
    .sort();

  // Filtra arquivos ja sincronizados
  const pending = lastFile
    ? files.filter((f) => f > lastFile)
    : files;

  if (pending.length === 0) {
    console.log("  Nenhuma sessao nova para sincronizar.");
  } else {
    console.log(`  ${pending.length} sessao(oes) pendente(s):\n`);

    let totalCount = 0;
    for (const file of pending) {
      try {
        const count = await syncSessionFile(join(SESSIONS_DIR, file));
        totalCount += count;
        await recordSync("sessions", file, count);
      } catch (err) {
        console.error(`  [ERRO] ${file}: ${err.message}`);
        await recordSync("sessions", file, 0, "error", err.message);
      }
    }

    console.log(`\n  Total: ${totalCount} registros sincronizados.`);
  }

  // Sync events log
  console.log("");
  await syncEventsLog();
}

// --- Watch (daemon) ---

async function watchMode() {
  console.log("Modo watch ativo. Observando novos arquivos JSONL...\n");
  console.log(`  Sessions: ${SESSIONS_DIR}`);
  console.log(`  Events:   ${EVENTS_LOG}`);
  console.log("\n  Ctrl+C para sair.\n");

  // Sync inicial
  await syncAllSessions();

  // Watch sessions dir
  if (existsSync(SESSIONS_DIR)) {
    const sessionsWatcher = watch(SESSIONS_DIR, async (eventType, filename) => {
      if (!filename || !filename.endsWith(".jsonl")) return;

      // Debounce: espera 2s para o arquivo ser completamente escrito
      await new Promise((r) => setTimeout(r, 2000));

      console.log(`\n  [watch] Detectado: ${filename}`);
      try {
        const count = await syncSessionFile(join(SESSIONS_DIR, filename));
        await recordSync("sessions", filename, count);
        console.log(`  [watch] OK — ${count} registros`);
      } catch (err) {
        console.error(`  [watch] ERRO: ${err.message}`);
      }
    });

    process.on("SIGINT", () => {
      sessionsWatcher.close();
      console.log("\n\nWatch encerrado.");
      process.exit(0);
    });
  }

  // Periodic sync do events log (a cada 60s)
  setInterval(async () => {
    try {
      await syncEventsLog();
    } catch (err) {
      console.error(`  [periodic] Erro sincronizando eventos: ${err.message}`);
    }
  }, 60_000);

  // Manter processo vivo
  await new Promise(() => {});
}

// --- Status ---

async function showStatus() {
  console.log("Bridge OpenClaw <-> Supabase\n");
  console.log(`  Supabase URL: ${SUPABASE_URL || "(nao configurado)"}`);
  console.log(`  Key:          ${SUPABASE_KEY ? "***" + SUPABASE_KEY.slice(-8) : "(nao configurado)"}`);
  console.log(`  Sessions dir: ${SESSIONS_DIR}`);
  console.log(`  Events log:   ${EVENTS_LOG}\n`);

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error("ERRO: Variaveis SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY nao configuradas.");
    process.exit(1);
  }

  // Testar conexao
  try {
    const sessions = await supabaseQuery("sessions", "GET", null, "select=id&limit=1");
    console.log("  Conexao:      OK");
  } catch (err) {
    console.log(`  Conexao:      ERRO — ${err.message}`);
    console.log("\n  Dica: Execute 'node bridge.js migrate' para criar as tabelas.\n");
    return;
  }

  // Contadores (via HEAD + Prefer: count=exact)
  try {
    const counts = await Promise.all(
      ["sessions", "messages", "events"].map(async (table) => {
        const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}?select=id`, {
          method: "HEAD",
          headers: {
            apikey: SUPABASE_KEY,
            Authorization: `Bearer ${SUPABASE_KEY}`,
            Prefer: "count=exact",
          },
        });
        const range = res.headers.get("content-range") || "";
        // Format: "0-N/total" or "*/total" or "*/0"
        const match = range.match(/\/(\d+)$/);
        return match ? parseInt(match[1], 10) : "?";
      })
    );
    console.log(`  Sessoes:      ${counts[0]}`);
    console.log(`  Mensagens:    ${counts[1]}`);
    console.log(`  Eventos:      ${counts[2]}`);
  } catch {
    // Tabelas podem nao existir ainda
  }

  // Ultimo sync
  const lastSync = await getLastSync("sessions");
  if (lastSync) {
    console.log(`\n  Ultimo sync:  ${lastSync.last_synced_at}`);
    console.log(`  Arquivo:      ${lastSync.last_synced_file}`);
    console.log(`  Status:       ${lastSync.status}`);
  } else {
    console.log("\n  Nenhuma sincronizacao registrada.");
  }

  // Arquivos locais
  if (existsSync(SESSIONS_DIR)) {
    const localFiles = readdirSync(SESSIONS_DIR).filter((f) =>
      f.endsWith(".jsonl")
    );
    console.log(`\n  Sessoes locais: ${localFiles.length} arquivo(s) JSONL`);
  }

  console.log("");
}

// --- Main ---

async function main() {
  const command = process.argv[2];

  if (!command || command === "help") {
    console.log(`
Bridge OpenClaw <-> Supabase

Uso:
  node bridge.js status   Estado da conexao e contadores
  node bridge.js migrate  Criar/atualizar tabelas no Supabase
  node bridge.js sync     Sincronizar sessoes JSONL pendentes
  node bridge.js watch    Daemon: observar e sincronizar em tempo real
  node bridge.js help     Este help
`);
    return;
  }

  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error(
      "ERRO: Configure SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY no ambiente.\n"
    );
    process.exit(1);
  }

  switch (command) {
    case "status":
      await showStatus();
      break;
    case "migrate":
      await runMigrations();
      break;
    case "sync":
      await syncAllSessions();
      break;
    case "watch":
      await watchMode();
      break;
    default:
      console.error(`Comando desconhecido: ${command}`);
      process.exit(1);
  }
}

main().catch((err) => {
  console.error(`Erro fatal: ${err.message}`);
  process.exit(1);
});
