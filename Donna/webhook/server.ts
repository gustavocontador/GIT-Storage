/**
 * Donna WhatsApp Webhook Server v2
 *
 * Bun-native server — zero external dependencies.
 * Primary: WAHA (WhatsApp Web API) for send/receive.
 * Fallback: Meta Cloud API + ChakraHQ for receiving from third parties.
 *
 * Features: typing indicator, reactions, forwarding, contact lookup,
 * polls, label enrichment, YouTube detection, chat history.
 */

// --- Config ---

const PORT = Number(Bun.env.WEBHOOK_PORT) || 3001;
const AGENT_TIMEOUT = Number(Bun.env.AGENT_TIMEOUT) || 120;
const DEBOUNCE_MS = Number(Bun.env.DEBOUNCE_MS) || 5_000;
const OWNER_NUMBER = Bun.env.OWNER_NUMBER ?? "5511991461629";

// WAHA config (primary)
const WAHA_API_URL = Bun.env.WAHA_API_URL ?? "http://localhost:3002";
const WAHA_API_KEY = Bun.env.WAHA_API_KEY ?? "donna-waha-2026";
const WAHA_SESSION = Bun.env.WAHA_SESSION ?? "donna";

// Cloud API config (fallback for receiving)
const VERIFY_TOKEN = Bun.env.WHATSAPP_VERIFY_TOKEN ?? "";
const APP_SECRET = Bun.env.WHATSAPP_APP_SECRET ?? "";
const API_TOKEN = Bun.env.WHATSAPP_API_TOKEN ?? "";
const PHONE_ID = Bun.env.WHATSAPP_PHONE_ID ?? "";
const CHAKRA_API_KEY = Bun.env.CHAKRA_API_KEY ?? "";
const GRAPH_API = `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`;

// --- Anti-loop: track messages WE sent ---

const sentMessageIds = new Set<string>();
const sentTexts = new Set<string>();
const SENT_ID_TTL = 60_000;

function trackSentMessage(id: string, text: string): void {
  sentMessageIds.add(id);
  sentTexts.add(text);
  setTimeout(() => sentMessageIds.delete(id), SENT_ID_TTL);
  setTimeout(() => sentTexts.delete(text), SENT_ID_TTL);
}

const processedWebhookIds = new Set<string>();
function dedupeWebhook(eventId: string): boolean {
  if (!eventId) return false;
  if (processedWebhookIds.has(eventId)) return true;
  processedWebhookIds.add(eventId);
  setTimeout(() => processedWebhookIds.delete(eventId), 10_000);
  return false;
}

// --- Helpers ---

async function hmacSHA256(secret: string, payload: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  const bufA = new TextEncoder().encode(a);
  const bufB = new TextEncoder().encode(b);
  let diff = 0;
  for (let i = 0; i < bufA.length; i++) {
    diff |= bufA[i] ^ bufB[i];
  }
  return diff === 0;
}

function jidToNumber(jid: string): string {
  return jid.replace(/@.*$/, "");
}

// =====================================================================
// FASE 0A: WAHA API Helpers
// =====================================================================

const wahaHeaders = {
  "Content-Type": "application/json",
  "X-Api-Key": WAHA_API_KEY,
};

const wahaApi = {
  async sendPresence(chatId: string, presence: "composing" | "paused" | "available"): Promise<void> {
    try {
      await fetch(`${WAHA_API_URL}/api/sendPresence`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({ session: WAHA_SESSION, chatId, presence }),
      });
    } catch { /* best-effort */ }
  },

  async sendReaction(chatId: string, messageId: string, reaction: string): Promise<boolean> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/sendSeen`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({ session: WAHA_SESSION, chatId }),
      });
      const resp2 = await fetch(`${WAHA_API_URL}/api/reaction`, {
        method: "PUT",
        headers: wahaHeaders,
        body: JSON.stringify({ session: WAHA_SESSION, messageId, reaction }),
      });
      return resp2.ok;
    } catch (e) {
      console.error("[waha:reaction] failed:", e);
      return false;
    }
  },

  async forwardMessage(fromChatId: string, messageId: string, toChatId: string): Promise<boolean> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/sendText`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({
          session: WAHA_SESSION,
          chatId: toChatId,
          text: `[Encaminhado]`,
          // WAHA NOWEB doesn't have native forward — use quote/reply
        }),
      });
      return resp.ok;
    } catch (e) {
      console.error("[waha:forward] failed:", e);
      return false;
    }
  },

  async sendPoll(chatId: string, title: string, options: string[], multipleAnswers = false): Promise<boolean> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/sendPoll`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({ session: WAHA_SESSION, chatId, poll: { name: title, options, multipleAnswers } }),
      });
      return resp.ok;
    } catch (e) {
      console.error("[waha:poll] failed:", e);
      return false;
    }
  },

  async getContacts(): Promise<any[]> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/contacts/all?session=${WAHA_SESSION}`, {
        headers: { "X-Api-Key": WAHA_API_KEY },
      });
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  },

  async getLabels(): Promise<any[]> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/${WAHA_SESSION}/labels`, {
        headers: { "X-Api-Key": WAHA_API_KEY },
      });
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  },

  async getChatLabels(chatId: string): Promise<string[]> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/${WAHA_SESSION}/labels/chat/${chatId}`, {
        headers: { "X-Api-Key": WAHA_API_KEY },
      });
      if (!resp.ok) return [];
      const labels = await resp.json();
      return labels.map((l: any) => l.name || l.label || "").filter(Boolean);
    } catch { return []; }
  },

  async getChatMessages(chatId: string, limit = 20): Promise<any[]> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/${WAHA_SESSION}/chats/${chatId}/messages?limit=${limit}`, {
        headers: { "X-Api-Key": WAHA_API_KEY },
      });
      if (!resp.ok) return [];
      return await resp.json();
    } catch { return []; }
  },

  async downloadMedia(messageId: string, session = WAHA_SESSION): Promise<{ mimetype: string; data: string } | null> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/${session}/media?messageId=${messageId}`, {
        headers: { "X-Api-Key": WAHA_API_KEY },
      });
      if (!resp.ok) return null;
      return await resp.json();
    } catch { return null; }
  },

  async sendFile(chatId: string, base64: string, mimetype: string, filename: string, caption?: string): Promise<boolean> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/sendFile`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({
          session: WAHA_SESSION,
          chatId,
          file: { mimetype, data: base64, filename },
          caption,
        }),
      });
      return resp.ok;
    } catch { return false; }
  },

  async sendImage(chatId: string, base64: string, caption?: string): Promise<boolean> {
    try {
      const resp = await fetch(`${WAHA_API_URL}/api/sendImage`, {
        method: "POST",
        headers: wahaHeaders,
        body: JSON.stringify({
          session: WAHA_SESSION,
          chatId,
          file: { mimetype: "image/png", data: base64 },
          caption,
        }),
      });
      return resp.ok;
    } catch { return false; }
  },
};

// =====================================================================
// FASE 0C: Contact Cache with Fuzzy Lookup
// =====================================================================

interface CachedContact {
  name: string;
  number: string;
  jid: string;
}

let contactsCache: CachedContact[] = [];
let contactsCacheTime = 0;
const CONTACTS_CACHE_TTL = 300_000; // 5 min

async function refreshContacts(): Promise<void> {
  try {
    const raw = await wahaApi.getContacts();
    contactsCache = raw.map((c: any) => ({
      name: c.name || c.pushName || c.shortName || "",
      number: jidToNumber(c.id || ""),
      jid: c.id || "",
    })).filter((c: CachedContact) => c.number && c.name);
    contactsCacheTime = Date.now();
    console.log(`[contacts] cached ${contactsCache.length} contacts`);
  } catch (e) {
    console.error("[contacts] refresh failed:", e);
  }
}

function lookupContact(query: string): CachedContact | null {
  if (Date.now() - contactsCacheTime > CONTACTS_CACHE_TTL) {
    refreshContacts(); // async, use stale cache
  }
  const q = query.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  // Exact number match
  const byNumber = contactsCache.find(c => c.number === query);
  if (byNumber) return byNumber;
  // Fuzzy name match
  return contactsCache.find(c => {
    const n = c.name.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    return n.includes(q) || q.includes(n);
  }) || null;
}

// Init contacts on startup (async, non-blocking)
setTimeout(refreshContacts, 3000);

// =====================================================================
// FASE 0B: Agent Action Protocol
// =====================================================================

interface AgentAction {
  type: "text" | "reaction" | "forward" | "poll";
  text?: string;
  reaction?: string;
  forwardTo?: string;
  forwardText?: string;
  pollTitle?: string;
  pollOptions?: string[];
}

function parseAgentActions(rawText: string, originalMessageId: string): AgentAction[] {
  const actions: AgentAction[] = [];
  let text = rawText;

  // [REACTION:emoji]
  const reactionMatch = text.match(/\[REACTION:([^\]]+)\]/);
  if (reactionMatch) {
    actions.push({ type: "reaction", reaction: reactionMatch[1].trim() });
    text = text.replace(/\[REACTION:[^\]]+\]\s*/g, "").trim();
  }

  // [FORWARD:name_or_number:text_to_send]
  const forwardMatch = text.match(/\[FORWARD:([^:]+):([^\]]+)\]/);
  if (forwardMatch) {
    const target = forwardMatch[1].trim();
    const fwdText = forwardMatch[2].trim();
    const contact = lookupContact(target);
    if (contact) {
      actions.push({ type: "forward", forwardTo: `${contact.number}@c.us`, forwardText: fwdText });
    } else {
      actions.push({ type: "text", text: `Nao encontrei o contato "${target}" na sua lista.` });
    }
    text = text.replace(/\[FORWARD:[^\]]+\]\s*/g, "").trim();
  }

  // [POLL:titulo:opt1,opt2,opt3]
  const pollMatch = text.match(/\[POLL:([^:]+):([^\]]+)\]/);
  if (pollMatch) {
    actions.push({
      type: "poll",
      pollTitle: pollMatch[1].trim(),
      pollOptions: pollMatch[2].split(",").map(s => s.trim()),
    });
    text = text.replace(/\[POLL:[^\]]+\]\s*/g, "").trim();
  }

  // Remaining text
  if (text) {
    actions.push({ type: "text", text });
  }

  return actions.length > 0 ? actions : [{ type: "text", text: rawText }];
}

// =====================================================================
// Common message interface
// =====================================================================

interface ExtractedMessage {
  from: string;
  name: string;
  type: string;
  text: string;
  chatId: string;
  labels?: string[];
  mediaId?: string;
  mimeType?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  messageId: string;
  source: "waha" | "meta" | "chakra";
}

// =====================================================================
// Extract from WAHA webhook
// =====================================================================

function extractWahaMessage(body: any): ExtractedMessage | null {
  try {
    if (body?.event !== "message" && body?.event !== "message.any") return null;

    const payload = body.payload;
    if (!payload) return null;

    const key = payload.key || payload;
    const msgId = key.id || payload.id;
    const fromMe = key.fromMe ?? payload.fromMe ?? false;
    const remoteJid = key.remoteJid || payload.from || "";
    const chatId = key.remoteJid || payload.chatId || remoteJid;
    const fromNumber = jidToNumber(remoteJid);
    const me = body.me?.id ? jidToNumber(body.me.id) : OWNER_NUMBER;

    // Anti-loop: ignore messages we sent via API (by ID)
    if (sentMessageIds.has(msgId)) {
      console.log(`[waha:anti-loop] ignoring sent message (id match) ${msgId}`);
      return null;
    }

    if (fromMe) {
      const isSelfChat = fromNumber === me || jidToNumber(chatId) === me;
      if (!isSelfChat) return null;

      const msgText = payload.body
        || payload.message?.conversation
        || payload.message?.extendedTextMessage?.text
        || "";
      if (sentTexts.has(msgText)) {
        console.log(`[waha:anti-loop] ignoring sent message (text match): ${msgText.substring(0, 40)}`);
        return null;
      }

      console.log(`[waha] self-chat from owner: ${msgText.substring(0, 40)}`);
    }

    const msg = payload.message || payload;
    let text = "";
    let type = "text";
    let mediaId: string | undefined;
    let mimeType: string | undefined;

    if (payload.body) {
      text = payload.body;
    } else if (msg.conversation) {
      text = msg.conversation;
    } else if (msg.extendedTextMessage?.text) {
      text = msg.extendedTextMessage.text;
    } else if (msg.imageMessage) {
      type = "image";
      text = msg.imageMessage.caption || "[imagem]";
      mimeType = msg.imageMessage.mimetype;
      mediaId = msgId;
    } else if (msg.audioMessage) {
      type = "audio";
      text = "[audio]";
      mimeType = msg.audioMessage.mimetype;
      mediaId = msgId;
    } else if (msg.videoMessage) {
      type = "video";
      text = msg.videoMessage.caption || "[video]";
      mimeType = msg.videoMessage.mimetype;
      mediaId = msgId;
    } else if (msg.documentMessage) {
      type = "document";
      text = msg.documentMessage.caption || `[documento: ${msg.documentMessage.fileName}]`;
      mimeType = msg.documentMessage.mimetype;
      mediaId = msgId;
    } else if (msg.stickerMessage) {
      type = "sticker";
      text = "[sticker]";
    } else if (msg.reactionMessage) {
      type = "reaction";
      text = `[reacao: ${msg.reactionMessage.text}]`;
    } else if (msg.locationMessage) {
      type = "location";
      text = `[localizacao: ${msg.locationMessage.degreesLatitude}, ${msg.locationMessage.degreesLongitude}]`;
    }

    if (!text) return null;

    const pushName = payload.pushName || body.me?.pushName || fromNumber;

    return {
      from: fromNumber,
      name: fromMe ? "Gustavo (self)" : pushName,
      type,
      text,
      chatId,
      mediaId,
      mimeType,
      timestamp: String(payload.messageTimestamp || Math.floor(Date.now() / 1000)),
      messageId: msgId,
      source: "waha",
    };
  } catch (e) {
    console.error("[waha:extract] failed:", e);
    return null;
  }
}

// =====================================================================
// Extract from Meta Cloud API webhook
// =====================================================================

function extractMetaMessage(body: any): ExtractedMessage | null {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    if (!value?.messages?.length) return null;

    const msg = value.messages[0];
    const contact = value.contacts?.[0];
    const from = msg.from;

    const base = {
      from,
      name: contact?.profile?.name ?? from,
      chatId: `${from}@c.us`,
      timestamp: msg.timestamp,
      messageId: msg.id,
      source: "meta" as const,
    };

    switch (msg.type) {
      case "text":
        return { ...base, type: "text", text: msg.text.body };
      case "image":
        return { ...base, type: "image", text: msg.image?.caption ?? "[imagem]", mediaId: msg.image?.id, mimeType: msg.image?.mime_type };
      case "audio":
        return { ...base, type: "audio", text: "[audio]", mediaId: msg.audio?.id, mimeType: msg.audio?.mime_type };
      case "video":
        return { ...base, type: "video", text: msg.video?.caption ?? "[video]", mediaId: msg.video?.id, mimeType: msg.video?.mime_type };
      case "document":
        return { ...base, type: "document", text: msg.document?.caption ?? `[documento: ${msg.document?.filename}]`, mediaId: msg.document?.id, mimeType: msg.document?.mime_type };
      case "location":
        return { ...base, type: "location", text: `[localizacao: ${msg.location?.latitude}, ${msg.location?.longitude}]`, latitude: msg.location?.latitude, longitude: msg.location?.longitude };
      default:
        return { ...base, type: msg.type, text: `[${msg.type}]` };
    }
  } catch (e) {
    console.error("[meta:extract] failed:", e);
    return null;
  }
}

// =====================================================================
// Extract from ChakraHQ webhook
// =====================================================================

function extractChakraMessage(body: any): ExtractedMessage | null {
  try {
    if (!body?.event || !body?.payload?.message) return null;
    if (body.event === "smb_message_echo") return null;

    const m = body.payload.message;
    const contacts = body.payload.contacts || [];
    const from = m.from || "";
    if (!from) return null;

    const text = m.text?.body || m.caption || "";
    if (!text) return null;

    return {
      from,
      name: contacts[0]?.profile?.name || from,
      type: m.type || "text",
      text,
      chatId: `${from}@c.us`,
      timestamp: m.timestamp || String(Date.now() / 1000),
      messageId: m.id || `chakra_${Date.now()}`,
      source: "chakra",
    };
  } catch (e) {
    console.error("[chakra:extract] failed:", e);
    return null;
  }
}

// =====================================================================
// Message Enrichment (labels, YouTube detection, history)
// =====================================================================

async function enrichMessage(msg: ExtractedMessage): Promise<string> {
  let enriched = msg.text;
  const parts: string[] = [];

  // Label enrichment (Feature 10)
  try {
    const labels = await wahaApi.getChatLabels(msg.chatId);
    if (labels.length > 0) {
      msg.labels = labels;
      parts.push(`[CONTACT_LABELS: ${labels.join(", ")}]`);
    }
  } catch { /* ignore */ }

  // YouTube URL detection (Feature 9)
  const ytMatch = msg.text.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) {
    parts.push(`[YOUTUBE_URL: ${ytMatch[0]}] Use o skill youtube-transcript para transcrever e resuma em 5 pontos.`);
  }

  // Chat history request detection (Feature 11)
  const historyMatch = msg.text.match(/o que .+ (?:me )?mandou|historico|ultimas mensagens|mensagens recentes/i);
  if (historyMatch) {
    try {
      const messages = await wahaApi.getChatMessages(msg.chatId, 30);
      if (messages.length > 0) {
        const history = messages.slice(-20).map((m: any) => {
          const sender = m.key?.fromMe ? "Gustavo" : (m.pushName || "Contato");
          const txt = m.message?.conversation || m.message?.extendedTextMessage?.text || "[media]";
          return `${sender}: ${txt}`;
        }).join("\n");
        parts.push(`[CHAT_HISTORY:\n${history}\n]`);
      }
    } catch { /* ignore */ }
  }

  // Contact info for forwarding context
  const contact = lookupContact(msg.from);
  if (contact && contact.name) {
    parts.push(`[CONTACT_NAME: ${contact.name}]`);
  }

  // Feature 12: PDF detection — download and pass to agent
  if (msg.type === "document" && msg.mimeType?.includes("pdf") && msg.mediaId) {
    const filePath = await downloadMediaToFile(msg.mediaId, msg.mimeType, "pdf");
    if (filePath) {
      parts.push(`[PDF_FILE: ${filePath}] O usuario enviou um PDF. Use o skill pdf para ler e faca um resumo executivo com os 5 pontos principais.`);
    }
  }

  // Feature 13: Audio detection — download for transcription
  if (msg.type === "audio" && msg.mediaId) {
    const filePath = await downloadMediaToFile(msg.mediaId, msg.mimeType || "audio/ogg", "ogg");
    if (filePath) {
      parts.push(`[AUDIO_FILE: ${filePath}] O usuario enviou um audio. Use o skill openai-whisper-api para transcrever em pt-BR. Depois interprete: extraia tarefas, follow-ups, compromissos, lembretes. Crie no Notion e confirme.`);
    }
  }

  // Feature 12b: Image detection — download for analysis
  if (msg.type === "image" && msg.mediaId) {
    const filePath = await downloadMediaToFile(msg.mediaId, msg.mimeType || "image/jpeg", "jpg");
    if (filePath) {
      parts.push(`[IMAGE_FILE: ${filePath}] O usuario enviou uma imagem. Descreva o conteudo e interprete no contexto da conversa.`);
    }
  }

  if (parts.length > 0) {
    enriched = parts.join(" ") + " " + enriched;
  }

  return enriched;
}

// --- Media download helper ---

async function downloadMediaToFile(messageId: string, mimetype: string, ext: string): Promise<string | null> {
  try {
    const media = await wahaApi.downloadMedia(messageId);
    if (!media?.data) return null;

    const tmpPath = `/tmp/donna-media-${Date.now()}.${ext}`;
    const buffer = Buffer.from(media.data, "base64");
    await Bun.write(tmpPath, buffer);
    console.log(`[media] downloaded ${ext} to ${tmpPath} (${buffer.length} bytes)`);

    // Cleanup after 5 min
    setTimeout(() => { try { require("fs").unlinkSync(tmpPath); } catch {} }, 300_000);

    return tmpPath;
  } catch (e) {
    console.error(`[media] download failed:`, e);
    return null;
  }
}

// =====================================================================
// Debounce per sender
// =====================================================================

interface PendingBuffer {
  messages: ExtractedMessage[];
  timer: ReturnType<typeof setTimeout>;
}

const pendingByContact = new Map<string, PendingBuffer>();

function enqueueMessage(msg: ExtractedMessage): void {
  const key = msg.from;
  const existing = pendingByContact.get(key);

  if (existing) {
    clearTimeout(existing.timer);
    existing.messages.push(msg);
    console.log(`[debounce] +1 from ${msg.name} (${key}), buffer=${existing.messages.length}, resetting ${DEBOUNCE_MS}ms timer`);
  } else {
    const buf: PendingBuffer = { messages: [msg], timer: null as any };
    pendingByContact.set(key, buf);
    console.log(`[debounce] new from ${msg.name} (${key}), waiting ${DEBOUNCE_MS}ms`);
  }

  const buf = pendingByContact.get(key)!;
  buf.timer = setTimeout(() => flushContact(key), DEBOUNCE_MS);
}

function flushContact(key: string): void {
  const buf = pendingByContact.get(key);
  if (!buf) return;
  pendingByContact.delete(key);

  const msgs = buf.messages;
  console.log(`[debounce] flushing ${msgs.length} message(s) from ${msgs[0].name} (${key})`);

  const combined: ExtractedMessage = {
    ...msgs[0],
    text: msgs.map(m => m.text).join("\n"),
    messageId: msgs[msgs.length - 1].messageId,
  };

  handleIncomingMessage(combined);
}

// =====================================================================
// Process via OpenClaw Agent CLI
// =====================================================================

async function processWithAgent(msg: ExtractedMessage): Promise<AgentAction[]> {
  const from = msg.from.startsWith("+") ? msg.from : `+${msg.from}`;

  // Enrich message with labels, YouTube, history, contact info
  const enrichedText = await enrichMessage(msg);

  try {
    const proc = Bun.spawn(
      ["openclaw", "agent", "--to", from, "--message", enrichedText, "--json", "--timeout", String(AGENT_TIMEOUT)],
      { stdout: "pipe", stderr: "pipe" },
    );

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      console.error(`[agent] exit ${exitCode}: ${stderr.substring(0, 200)}`);
      return [];
    }

    const result = JSON.parse(stdout);
    const payloads = result?.result?.payloads;
    if (!payloads?.length) {
      console.warn("[agent] no payloads in response");
      return [];
    }

    const fullText = payloads
      .map((p: any) => p.text)
      .filter(Boolean)
      .join("\n\n");

    if (!fullText) return [];

    return parseAgentActions(fullText, msg.messageId);
  } catch (e) {
    console.error("[agent] failed:", e);
    return [];
  }
}

// =====================================================================
// Send via WAHA (primary)
// =====================================================================

async function sendViaWAHA(chatId: string, text: string): Promise<boolean> {
  try {
    const resp = await fetch(`${WAHA_API_URL}/api/sendText`, {
      method: "POST",
      headers: wahaHeaders,
      body: JSON.stringify({ session: WAHA_SESSION, chatId, text }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      console.error(`[send:waha] ${resp.status}: ${err}`);
      return false;
    }

    const result = await resp.json().catch(() => null);
    if (result?.key?.id) {
      trackSentMessage(result.key.id, text);
    }

    console.log(`[send:waha] message sent to ${chatId}`);
    return true;
  } catch (e) {
    console.error("[send:waha] fetch failed:", e);
    return false;
  }
}

// =====================================================================
// Send via Cloud API (fallback)
// =====================================================================

async function sendViaGraphAPI(to: string, text: string): Promise<boolean> {
  if (!API_TOKEN || !PHONE_ID) return false;

  try {
    const resp = await fetch(GRAPH_API, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${API_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        recipient_type: "individual",
        to,
        type: "text",
        text: { preview_url: true, body: text },
      }),
    });

    if (!resp.ok) {
      const err = await resp.text().catch(() => "");
      console.error(`[send:graph] ${resp.status}: ${err}`);
      return false;
    }

    console.log(`[send:graph] message sent to ${to}`);
    return true;
  } catch (e) {
    console.error("[send:graph] fetch failed:", e);
    return false;
  }
}

// =====================================================================
// Smart send: WAHA primary, Graph API fallback
// =====================================================================

async function sendWhatsApp(to: string, text: string, chatId?: string): Promise<boolean> {
  const wahaChatId = chatId || `${to}@c.us`;
  const wahaSent = await sendViaWAHA(wahaChatId, text);
  if (wahaSent) return true;

  console.warn(`[send] WAHA failed for ${to} — trying Graph API fallback`);
  return sendViaGraphAPI(to, text);
}

// =====================================================================
// Bridge: receive → typing → agent → dispatch actions
// =====================================================================

async function handleIncomingMessage(msg: ExtractedMessage): Promise<void> {
  console.log(`[recv] ${msg.type} from ${msg.name} (${msg.from}) via ${msg.source}: ${msg.text.substring(0, 80)}`);

  // Feature 1: Show typing indicator
  await wahaApi.sendPresence(msg.chatId, "composing");

  const actions = await processWithAgent(msg);

  if (actions.length === 0) {
    await wahaApi.sendPresence(msg.chatId, "available");
    console.warn(`[bridge] no actions from agent for ${msg.from}`);
    return;
  }

  for (const action of actions) {
    switch (action.type) {
      case "text":
        const sent = await sendWhatsApp(msg.from, action.text!, msg.chatId);
        if (sent) {
          console.log(`[bridge] ${msg.name} → text reply (${action.text!.length} chars)`);
        } else {
          console.error(`[bridge] failed to send text to ${msg.from}`);
        }
        break;

      case "reaction":
        const reacted = await wahaApi.sendReaction(msg.chatId, msg.messageId, action.reaction!);
        console.log(`[bridge] ${msg.name} → reaction ${action.reaction} (${reacted ? "ok" : "failed"})`);
        break;

      case "forward":
        if (action.forwardText && action.forwardTo) {
          const fwdSent = await sendViaWAHA(action.forwardTo, action.forwardText);
          console.log(`[bridge] forward to ${action.forwardTo} (${fwdSent ? "ok" : "failed"})`);
        }
        break;

      case "poll":
        if (action.pollTitle && action.pollOptions) {
          const pollSent = await wahaApi.sendPoll(msg.chatId, action.pollTitle, action.pollOptions);
          console.log(`[bridge] poll "${action.pollTitle}" (${pollSent ? "ok" : "failed"})`);
        }
        break;
    }
  }
}

// =====================================================================
// HTTP Server
// =====================================================================

const server = Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Health check
    if (req.method === "GET" && url.pathname === "/health") {
      return Response.json({
        status: "ok",
        uptime: process.uptime(),
        waha: WAHA_API_URL,
        contacts: contactsCache.length,
        timestamp: new Date().toISOString(),
      });
    }

    // --- WAHA webhook (primary) ---
    if (req.method === "POST" && url.pathname === "/waha") {
      const rawBody = await req.text();
      const body = JSON.parse(rawBody);

      // Dedupe: WAHA sends both 'message' and 'message.any' for same event
      const eventId = body?.payload?.key?.id || body?.payload?.id || "";
      if (eventId && dedupeWebhook(eventId)) {
        return new Response("OK", { status: 200 });
      }

      const msg = extractWahaMessage(body);
      if (msg) {
        console.log(`[waha] ${msg.type} from ${msg.name} (${msg.from}): ${msg.text.substring(0, 80)}`);

        // Self-chat: no debounce, process immediately
        const isOwner = msg.from === OWNER_NUMBER;
        if (isOwner && msg.source === "waha") {
          handleIncomingMessage(msg);
        } else {
          enqueueMessage(msg);
        }
      }

      return new Response("OK", { status: 200 });
    }

    // --- Meta webhook verification ---
    if (req.method === "GET" && (url.pathname === "/webhook" || url.pathname === "/")) {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("[verify] webhook verified successfully");
        return new Response(challenge, { status: 200 });
      }
      return new Response("Forbidden", { status: 403 });
    }

    // --- Meta / ChakraHQ webhook (fallback receiving) ---
    if (req.method === "POST" && (url.pathname === "/webhook" || url.pathname === "/")) {
      const rawBody = await req.text();

      const metaSig = req.headers.get("x-hub-signature-256");
      if (metaSig && APP_SECRET) {
        const expected = await hmacSHA256(APP_SECRET, rawBody);
        const received = metaSig.replace("sha256=", "");
        if (!timingSafeEqual(expected, received)) {
          return new Response("Unauthorized", { status: 401 });
        }
      }

      const body = JSON.parse(rawBody);
      let msg = extractMetaMessage(body);
      if (!msg) msg = extractChakraMessage(body);

      if (msg) {
        console.log(`[${msg.source}] ${msg.type} from ${msg.name} (${msg.from}): ${msg.text.substring(0, 80)}`);
        enqueueMessage(msg);
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[donna-webhook] v2 running on http://localhost:${server.port}`);
console.log(`[donna-webhook] WAHA: ${WAHA_API_URL} (session: ${WAHA_SESSION})`);
console.log(`[donna-webhook] Send: WAHA primary → Graph API fallback`);
console.log(`[donna-webhook] Receive: /waha (WAHA) + /webhook (Meta/ChakraHQ)`);
console.log(`[donna-webhook] Features: typing, reactions, forward, polls, labels, YouTube, history`);
console.log(`[donna-webhook] Owner: ${OWNER_NUMBER} (no debounce)`);
console.log(`[donna-webhook] Agent timeout: ${AGENT_TIMEOUT}s | Debounce: ${DEBOUNCE_MS}ms`);
