#!/usr/bin/env bun

/**
 * Bridge OpenClaw + Claude Code <-> Supabase
 *
 * Sincroniza sessoes, mensagens e eventos do OpenClaw E Claude Code com o Supabase PostgreSQL.
 *
 * Uso:
 *   node bridge.js status   — Estado da conexao e ultima sincronizacao
 *   node bridge.js migrate  — Cria/atualiza tabelas no Supabase
 *   node bridge.js sync     — Sincroniza sessoes JSONL pendentes
 *   node bridge.js watch    — Daemon: observar e sincronizar em tempo real
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
const CLAUDE_CODE_DIR = join(homedir(), ".claude", "projects");
const MIGRATIONS_DIR = join(
  process.env.AIOS_ROOT || join(homedir(), "Documents", "AIOS"),
  ".aios-core",
  "infrastructure",
  "migrations"
);

// --- Noise filters ---

const NOISE_PATTERNS = [
  /^HEARTBEAT/i,
  /^NO_REPLY$/,
  /^MEMORY\.md/,
  /conversation_label.*heartbeat/i,
  /WhatsApp gateway (dis)?connected/,
  /^System: \[/,
];

function isNoise(content) {
  if (!content || content.trim().length === 0) return true;
  return NOISE_PATTERNS.some((p) => p.test(content));
}

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
      const content = typeof msg.content === "string"
        ? msg.content
        : Array.isArray(msg.content)
          ? msg.content.map((c) => c.text || "").join("\n")
          : JSON.stringify(msg.content);

      // Filter noise
      if (isNoise(content)) continue;

      messages.push({
        openclaw_message_id: entry.id,
        role: msg.role,
        content,
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

// --- Parse Claude Code JSONL session ---

function parseClaudeCodeFile(filepath) {
  const lines = readFileSync(filepath, "utf-8")
    .split("\n")
    .filter((l) => l.trim());

  // Use filename (without .jsonl) as session ID — Claude Code reuses sessionId
  // across continuations, but each file is a distinct conversation
  const fileSessionId = basename(filepath, ".jsonl");

  const messages = [];
  let internalSessionId = null;
  let model = null;
  let startedAt = null;
  let cwd = null;

  for (const line of lines) {
    let entry;
    try {
      entry = JSON.parse(line);
    } catch {
      continue;
    }

    // Skip non-message types (progress, file-history-snapshot, queue-operation, system)
    if (!["user", "assistant"].includes(entry.type)) continue;

    if (!internalSessionId && entry.sessionId) internalSessionId = entry.sessionId;
    if (!cwd && entry.cwd) cwd = entry.cwd;
    if (!startedAt && entry.timestamp) startedAt = entry.timestamp;

    const msg = entry.message;
    if (!msg) continue;

    if (!model && msg.model) model = msg.model;

    // Extract text content
    let content = "";
    if (typeof msg.content === "string") {
      content = msg.content;
    } else if (Array.isArray(msg.content)) {
      content = msg.content
        .filter((c) => c.type === "text")
        .map((c) => c.text || "")
        .join("\n");
    }

    // Filter noise
    if (isNoise(content)) continue;

    // Truncate very large content (tool results, etc) to 10KB
    if (content.length > 10000) {
      content = content.substring(0, 10000) + "\n...[truncated]";
    }

    const usage = msg.usage || {};
    messages.push({
      openclaw_message_id: entry.uuid,
      role: msg.role,
      content,
      timestamp: entry.timestamp,
      token_count: (usage.input_tokens || 0) + (usage.output_tokens || 0) || null,
      cost: null,
      model: msg.model || null,
      stop_reason: msg.stop_reason || null,
      metadata: {
        parentUuid: entry.parentUuid,
        requestId: entry.requestId,
        source: "claude-code",
      },
    });
  }

  const session = fileSessionId
    ? {
        openclaw_session_id: fileSessionId,
        started_at: startedAt,
        model,
        metadata: { cwd, source: "claude-code", internalSessionId },
      }
    : null;

  return { session, messages, events: [] };
}

// --- Discover Claude Code sessions ---

function discoverClaudeCodeSessions() {
  if (!existsSync(CLAUDE_CODE_DIR)) return [];

  const files = [];
  const projects = readdirSync(CLAUDE_CODE_DIR);
  for (const project of projects) {
    const projectDir = join(CLAUDE_CODE_DIR, project);
    try {
      const items = readdirSync(projectDir).filter((f) => f.endsWith(".jsonl"));
      for (const item of items) {
        files.push({ path: join(projectDir, item), project, filename: item });
      }
    } catch {
      continue;
    }
  }
  return files;
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

async function syncClaudeCodeFile(filepath, project) {
  const filename = basename(filepath);
  const { session, messages } = parseClaudeCodeFile(filepath);

  if (!session) {
    console.log(`  [skip] ${filename} — sem dados de sessao`);
    return 0;
  }

  console.log(
    `  [cc-sync] ${project}/${filename} — ${messages.length} msgs`
  );

  // Upsert session
  session.metadata.project = project;
  const [sessionRow] = await supabaseUpsert("sessions", {
    openclaw_session_id: session.openclaw_session_id,
    model: session.model,
    cwd: session.metadata?.cwd,
    started_at: session.started_at,
    metadata: session.metadata,
  }, "openclaw_session_id");

  const sessionId = sessionRow.id;
  let count = 1;

  // Delete existing messages for this session (re-sync to handle updates)
  try {
    await supabaseQuery("messages", "DELETE", null, `session_id=eq.${sessionId}`);
  } catch { /* table may be empty */ }

  // Insert messages
  if (messages.length > 0) {
    const msgRows = messages.map((m) => ({
      ...m,
      session_id: sessionId,
    }));

    for (let i = 0; i < msgRows.length; i += 50) {
      const batch = msgRows.slice(i, i + 50);
      await supabaseQuery("messages", "POST", batch);
      count += batch.length;
    }
  }

  return count;
}

async function syncAllClaudeCode() {
  console.log("Sincronizando Claude Code sessions...\n");

  const ccFiles = discoverClaudeCodeSessions();
  if (ccFiles.length === 0) {
    console.log("  Nenhuma sessao Claude Code encontrada.");
    return;
  }

  console.log(`  ${ccFiles.length} sessao(oes) Claude Code encontrada(s):\n`);

  let totalCount = 0;
  for (const { path: fp, project, filename } of ccFiles) {
    const syncKey = `cc:${project}/${filename}`;
    try {
      const count = await syncClaudeCodeFile(fp, project);
      totalCount += count;
      await recordSync("claude-code", syncKey, count);
    } catch (err) {
      console.error(`  [ERRO] ${filename}: ${err.message}`);
      await recordSync("claude-code", syncKey, 0, "error", err.message);
    }
  }

  console.log(`\n  Claude Code total: ${totalCount} registros sincronizados.`);
}

async function syncAllSessions() {
  console.log("Sincronizando sessoes OpenClaw...\n");

  if (existsSync(SESSIONS_DIR)) {
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
      console.log("  Nenhuma sessao OpenClaw nova para sincronizar.");
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

      console.log(`\n  Total OpenClaw: ${totalCount} registros sincronizados.`);
    }
  } else {
    console.log(`  Diretorio OpenClaw nao encontrado: ${SESSIONS_DIR}`);
  }

  // Sync Claude Code sessions
  console.log("");
  await syncAllClaudeCode();

  // Sync events log
  console.log("");
  await syncEventsLog();
}

// --- Watch (daemon) ---

async function watchMode() {
  console.log("Modo watch ativo. Observando novos arquivos JSONL...\n");
  console.log(`  OpenClaw sessions: ${SESSIONS_DIR}`);
  console.log(`  Claude Code dir:   ${CLAUDE_CODE_DIR}`);
  console.log(`  Events log:        ${EVENTS_LOG}`);
  console.log("\n  Ctrl+C para sair.\n");

  const watchers = [];

  // Sync inicial
  await syncAllSessions();

  // Watch OpenClaw sessions dir
  if (existsSync(SESSIONS_DIR)) {
    const sessionsWatcher = watch(SESSIONS_DIR, async (eventType, filename) => {
      if (!filename || !filename.endsWith(".jsonl")) return;
      await new Promise((r) => setTimeout(r, 2000));

      console.log(`\n  [watch] Detectado OpenClaw: ${filename}`);
      try {
        const count = await syncSessionFile(join(SESSIONS_DIR, filename));
        await recordSync("sessions", filename, count);
        console.log(`  [watch] OK — ${count} registros`);
      } catch (err) {
        console.error(`  [watch] ERRO: ${err.message}`);
      }
    });
    watchers.push(sessionsWatcher);
  }

  // Watch Claude Code project dirs
  if (existsSync(CLAUDE_CODE_DIR)) {
    const projects = readdirSync(CLAUDE_CODE_DIR);
    for (const project of projects) {
      const projectDir = join(CLAUDE_CODE_DIR, project);
      try {
        const w = watch(projectDir, async (eventType, filename) => {
          if (!filename || !filename.endsWith(".jsonl")) return;
          await new Promise((r) => setTimeout(r, 3000));

          console.log(`\n  [watch-cc] Detectado: ${project}/${filename}`);
          try {
            const count = await syncClaudeCodeFile(
              join(projectDir, filename),
              project
            );
            await recordSync("claude-code", `cc:${project}/${filename}`, count);
            console.log(`  [watch-cc] OK — ${count} registros`);
          } catch (err) {
            console.error(`  [watch-cc] ERRO: ${err.message}`);
          }
        });
        watchers.push(w);
      } catch {
        continue;
      }
    }
  }

  process.on("SIGINT", () => {
    watchers.forEach((w) => w.close());
    console.log("\n\nWatch encerrado.");
    process.exit(0);
  });

  // Periodic sync: events log (60s) + Claude Code (5min)
  setInterval(async () => {
    try {
      await syncEventsLog();
    } catch (err) {
      console.error(`  [periodic] Erro sincronizando eventos: ${err.message}`);
    }
  }, 60_000);

  setInterval(async () => {
    try {
      await syncAllClaudeCode();
    } catch (err) {
      console.error(`  [periodic] Erro sincronizando Claude Code: ${err.message}`);
    }
  }, 300_000);

  // Manter processo vivo
  await new Promise(() => {});
}

// --- Status ---

async function showStatus() {
  console.log("Bridge OpenClaw + Claude Code <-> Supabase\n");
  console.log(`  Supabase URL:      ${SUPABASE_URL || "(nao configurado)"}`);
  console.log(`  Key:               ${SUPABASE_KEY ? "***" + SUPABASE_KEY.slice(-8) : "(nao configurado)"}`);
  console.log(`  OpenClaw sessions: ${SESSIONS_DIR}`);
  console.log(`  Claude Code dir:   ${CLAUDE_CODE_DIR}`);
  console.log(`  Events log:        ${EVENTS_LOG}\n`);

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
    console.log(`\n  OpenClaw local:    ${localFiles.length} arquivo(s) JSONL`);
  }

  // Claude Code sessions
  const ccFiles = discoverClaudeCodeSessions();
  console.log(`  Claude Code local: ${ccFiles.length} sessao(oes)`);
  if (ccFiles.length > 0) {
    const projects = [...new Set(ccFiles.map((f) => f.project))];
    for (const p of projects) {
      const pFiles = ccFiles.filter((f) => f.project === p);
      console.log(`    ${p}: ${pFiles.length} sessao(oes)`);
    }
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
