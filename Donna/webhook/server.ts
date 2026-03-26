/**
 * Donna WhatsApp Webhook Server
 *
 * Bun-native server — zero external dependencies.
 * Primary: WAHA (WhatsApp Web API) for send/receive.
 * Fallback: Meta Cloud API + ChakraHQ for receiving from third parties.
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

// --- Common message interface ---

interface ExtractedMessage {
  from: string;
  name: string;
  type: string;
  text: string;
  chatId: string;
  mediaId?: string;
  mimeType?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  messageId: string;
  source: "waha" | "meta" | "chakra";
}

// --- Extract from WAHA webhook ---

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
      // Message sent by the phone owner — only process if self-chat
      const isSelfChat = fromNumber === me || jidToNumber(chatId) === me;
      if (!isSelfChat) {
        return null; // Gustavo chatting with someone else
      }

      // Anti-loop: check if the text matches something we recently sent
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

    // Extract text from various WAHA message formats
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
    } else if (msg.audioMessage) {
      type = "audio";
      text = "[audio]";
      mimeType = msg.audioMessage.mimetype;
    } else if (msg.videoMessage) {
      type = "video";
      text = msg.videoMessage.caption || "[video]";
      mimeType = msg.videoMessage.mimetype;
    } else if (msg.documentMessage) {
      type = "document";
      text = msg.documentMessage.caption || `[documento: ${msg.documentMessage.fileName}]`;
      mimeType = msg.documentMessage.mimetype;
    } else if (msg.stickerMessage) {
      type = "sticker";
      text = "[sticker]";
    } else if (msg.reactionMessage) {
      type = "reaction";
      text = `[reação: ${msg.reactionMessage.text}]`;
    } else if (msg.locationMessage) {
      type = "location";
      text = `[localização: ${msg.locationMessage.degreesLatitude}, ${msg.locationMessage.degreesLongitude}]`;
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

// --- Extract from Meta Cloud API webhook ---

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
        return { ...base, type: "location", text: `[localização: ${msg.location?.latitude}, ${msg.location?.longitude}]`, latitude: msg.location?.latitude, longitude: msg.location?.longitude };
      default:
        return { ...base, type: msg.type, text: `[${msg.type}]` };
    }
  } catch (e) {
    console.error("[meta:extract] failed:", e);
    return null;
  }
}

// --- Extract from ChakraHQ webhook ---

function extractChakraMessage(body: any): ExtractedMessage | null {
  try {
    if (!body?.event || !body?.payload?.message) return null;
    // Ignore echo events from business owner
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

// --- Debounce per sender ---

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

// --- Process via OpenClaw Agent CLI ---

async function processWithAgent(msg: ExtractedMessage): Promise<string | null> {
  const from = msg.from.startsWith("+") ? msg.from : `+${msg.from}`;

  try {
    const proc = Bun.spawn(
      ["openclaw", "agent", "--to", from, "--message", msg.text, "--json", "--timeout", String(AGENT_TIMEOUT)],
      { stdout: "pipe", stderr: "pipe" },
    );

    const stdout = await new Response(proc.stdout).text();
    const stderr = await new Response(proc.stderr).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      console.error(`[agent] exit ${exitCode}: ${stderr.substring(0, 200)}`);
      return null;
    }

    const result = JSON.parse(stdout);
    const payloads = result?.result?.payloads;
    if (!payloads?.length) {
      console.warn("[agent] no payloads in response");
      return null;
    }

    const texts = payloads
      .map((p: any) => p.text)
      .filter(Boolean);

    return texts.join("\n\n") || null;
  } catch (e) {
    console.error("[agent] failed:", e);
    return null;
  }
}

// --- Send via WAHA (primary) ---

async function sendViaWAHA(chatId: string, text: string): Promise<boolean> {
  try {
    const resp = await fetch(`${WAHA_API_URL}/api/sendText`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Api-Key": WAHA_API_KEY,
      },
      body: JSON.stringify({
        session: WAHA_SESSION,
        chatId,
        text,
      }),
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

// --- Send via Cloud API (fallback) ---

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

// --- Smart send: WAHA primary, Graph API fallback ---

export async function sendWhatsApp(to: string, text: string, chatId?: string): Promise<boolean> {
  // Normalize chatId for WAHA
  const wahaChatId = chatId || `${to}@c.us`;

  // Try WAHA first
  const wahaSent = await sendViaWAHA(wahaChatId, text);
  if (wahaSent) return true;

  // Fallback to Graph API (won't work for self-messaging, but works for others)
  console.warn(`[send] WAHA failed for ${to} — trying Graph API fallback`);
  return sendViaGraphAPI(to, text);
}

// --- Bridge: receive → agent → reply ---

async function handleIncomingMessage(msg: ExtractedMessage): Promise<void> {
  console.log(`[recv] ${msg.type} from ${msg.name} (${msg.from}) via ${msg.source}: ${msg.text.substring(0, 80)}`);

  const reply = await processWithAgent(msg);

  if (reply) {
    const sent = await sendWhatsApp(msg.from, reply, msg.chatId);
    if (sent) {
      console.log(`[bridge] ${msg.name} → agent → reply sent (${reply.length} chars)`);
    } else {
      console.error(`[bridge] failed to send reply to ${msg.from}`);
    }
  } else {
    console.warn(`[bridge] no reply from agent for ${msg.from}`);
  }
}

// --- HTTP Server ---

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

      // HMAC validation
      const metaSig = req.headers.get("x-hub-signature-256");
      if (metaSig && APP_SECRET) {
        const expected = await hmacSHA256(APP_SECRET, rawBody);
        const received = metaSig.replace("sha256=", "");
        if (!timingSafeEqual(expected, received)) {
          return new Response("Unauthorized", { status: 401 });
        }
      }

      const body = JSON.parse(rawBody);

      // Try Meta format
      let msg = extractMetaMessage(body);

      // Try ChakraHQ format
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

console.log(`[donna-webhook] running on http://localhost:${server.port}`);
console.log(`[donna-webhook] WAHA: ${WAHA_API_URL} (session: ${WAHA_SESSION})`);
console.log(`[donna-webhook] Send: WAHA primary → Graph API fallback`);
console.log(`[donna-webhook] Receive: /waha (WAHA) + /webhook (Meta/ChakraHQ)`);
console.log(`[donna-webhook] Owner: ${OWNER_NUMBER}`);
console.log(`[donna-webhook] Agent timeout: ${AGENT_TIMEOUT}s`);
console.log(`[donna-webhook] Debounce: ${DEBOUNCE_MS}ms (${DEBOUNCE_MS / 1000}s)`);
