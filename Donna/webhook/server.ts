/**
 * Donna WhatsApp Cloud API Webhook Server
 *
 * Bun-native server — zero external dependencies.
 * Receives WhatsApp messages via Meta Cloud API or ChakraHQ webhook,
 * validates HMAC signatures, processes via OpenClaw agent CLI,
 * and sends responses back via ChakraHQ pass-through API.
 */

// --- Config ---

const PORT = Number(Bun.env.WEBHOOK_PORT) || 3001;
const VERIFY_TOKEN = Bun.env.WHATSAPP_VERIFY_TOKEN ?? "";
const APP_SECRET = Bun.env.WHATSAPP_APP_SECRET ?? "";
const API_TOKEN = Bun.env.WHATSAPP_API_TOKEN ?? "";
const PHONE_ID = Bun.env.WHATSAPP_PHONE_ID ?? "";
const CHAKRA_API_KEY = Bun.env.CHAKRA_API_KEY ?? "";
const CHAKRA_PLUGIN_ID = Bun.env.CHAKRA_PLUGIN_ID ?? "";
const GRAPH_API = CHAKRA_PLUGIN_ID
  ? `https://app.chakrahq.com/api/public/v1/whatsapp/${CHAKRA_PLUGIN_ID}/messages`
  : `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`;
const AGENT_TIMEOUT = Number(Bun.env.AGENT_TIMEOUT) || 120;
const DEBOUNCE_MS = Number(Bun.env.DEBOUNCE_MS) || 60_000;

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

async function validateSignature(body: string, signature: string | null): Promise<boolean> {
  if (!APP_SECRET) {
    console.warn("[HMAC] APP_SECRET not set — skipping validation");
    return true;
  }
  if (!signature) return false;
  const expected = await hmacSHA256(APP_SECRET, body);
  const received = signature.replace("sha256=", "");
  return timingSafeEqual(expected, received);
}

// --- Extract message from webhook payload ---

interface ExtractedMessage {
  from: string;
  name: string;
  type: string;
  text: string;
  mediaId?: string;
  mimeType?: string;
  latitude?: number;
  longitude?: number;
  timestamp: string;
  messageId: string;
}

function extractMessage(body: any): ExtractedMessage | null {
  try {
    const entry = body?.entry?.[0];
    const change = entry?.changes?.[0];
    const value = change?.value;
    if (!value?.messages?.length) return null;

    const msg = value.messages[0];
    const contact = value.contacts?.[0];

    const base = {
      from: msg.from,
      name: contact?.profile?.name ?? msg.from,
      type: msg.type,
      timestamp: msg.timestamp,
      messageId: msg.id,
    };

    switch (msg.type) {
      case "text":
        return { ...base, text: msg.text.body };
      case "image":
        return { ...base, text: msg.image?.caption ?? "[imagem]", mediaId: msg.image?.id, mimeType: msg.image?.mime_type };
      case "audio":
        return { ...base, text: "[audio]", mediaId: msg.audio?.id, mimeType: msg.audio?.mime_type };
      case "video":
        return { ...base, text: msg.video?.caption ?? "[video]", mediaId: msg.video?.id, mimeType: msg.video?.mime_type };
      case "document":
        return { ...base, text: msg.document?.caption ?? `[documento: ${msg.document?.filename}]`, mediaId: msg.document?.id, mimeType: msg.document?.mime_type };
      case "location":
        return { ...base, text: `[localização: ${msg.location?.latitude}, ${msg.location?.longitude}]`, latitude: msg.location?.latitude, longitude: msg.location?.longitude };
      case "sticker":
        return { ...base, text: "[sticker]", mediaId: msg.sticker?.id, mimeType: msg.sticker?.mime_type };
      case "reaction":
        return { ...base, text: `[reação: ${msg.reaction?.emoji}]` };
      default:
        return { ...base, text: `[${msg.type}]` };
    }
  } catch (e) {
    console.error("[extract] Failed to extract message:", e);
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

    // Concatenate all text payloads
    const texts = payloads
      .map((p: any) => p.text)
      .filter(Boolean);

    return texts.join("\n\n") || null;
  } catch (e) {
    console.error("[agent] failed:", e);
    return null;
  }
}

// --- Send WhatsApp message via Cloud API ---

export async function sendWhatsApp(to: string, text: string): Promise<boolean> {
  try {
    const headers: Record<string, string> = { "Content-Type": "application/json" };

    if (CHAKRA_API_KEY) {
      headers["x-api-key"] = CHAKRA_API_KEY;
    } else {
      headers["Authorization"] = `Bearer ${API_TOKEN}`;
    }

    const resp = await fetch(GRAPH_API, {
      method: "POST",
      headers,
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
      console.error(`[send] ${resp.status}: ${err}`);
      return false;
    }

    console.log(`[send] message sent to ${to} via ${CHAKRA_API_KEY ? "ChakraHQ" : "Meta"}`);
    return true;
  } catch (e) {
    console.error("[send] fetch failed:", e);
    return false;
  }
}

// --- Mark message as read ---

async function markAsRead(messageId: string): Promise<void> {
  try {
    await fetch(GRAPH_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        messaging_product: "whatsapp",
        status: "read",
        message_id: messageId,
      }),
    });
  } catch {
    // best-effort, don't log errors for read receipts
  }
}

// --- Bridge: receive → agent → reply ---

async function handleIncomingMessage(msg: ExtractedMessage): Promise<void> {
  console.log(`[recv] ${msg.type} from ${msg.name} (${msg.from}): ${msg.text.substring(0, 80)}`);

  // Process through OpenClaw agent
  const reply = await processWithAgent(msg);

  if (reply) {
    // Send reply via Cloud API
    const sent = await sendWhatsApp(msg.from, reply);
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
        timestamp: new Date().toISOString(),
      });
    }

    // Webhook verification (Meta one-time check)
    // Accepts both /webhook and / (Tailscale --set-path strips prefix)
    if (req.method === "GET" && (url.pathname === "/webhook" || url.pathname === "/")) {
      const mode = url.searchParams.get("hub.mode");
      const token = url.searchParams.get("hub.verify_token");
      const challenge = url.searchParams.get("hub.challenge");

      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        console.log("[verify] webhook verified successfully");
        return new Response(challenge, { status: 200 });
      }

      console.warn("[verify] failed — token mismatch");
      return new Response("Forbidden", { status: 403 });
    }

    // Webhook messages (Meta or ChakraHQ POST)
    if (req.method === "POST" && (url.pathname === "/webhook" || url.pathname === "/")) {
      const rawBody = await req.text();

      // Validate HMAC signature — accept Meta (x-hub-signature-256) or ChakraHQ (x-chakra-signature-256)
      const metaSig = req.headers.get("x-hub-signature-256");
      const chakraSig = req.headers.get("x-chakra-signature-256");

      if (metaSig) {
        const valid = await validateSignature(rawBody, metaSig);
        if (!valid) {
          console.warn("[hmac] invalid Meta signature — rejecting");
          return new Response("Unauthorized", { status: 401 });
        }
      } else if (chakraSig) {
        // ChakraHQ HMAC: no "sha256=" prefix, uses API key as secret
        const secret = CHAKRA_API_KEY || APP_SECRET;
        if (secret) {
          const expected = await hmacSHA256(secret, rawBody);
          if (!timingSafeEqual(expected, chakraSig)) {
            console.warn("[hmac] invalid ChakraHQ signature — rejecting");
            return new Response("Unauthorized", { status: 401 });
          }
        }
        console.log("[chakra] valid ChakraHQ webhook received");
      } else if (APP_SECRET) {
        // No signature at all but APP_SECRET is set — accept from ChakraHQ (they may not always sign)
        console.log("[webhook] no signature — accepting (ChakraHQ mode)");
      }

      // Respond 200 immediately
      const body = JSON.parse(rawBody);

      // Try Meta format first (entry[].changes[].value.messages[])
      let msg = extractMessage(body);

      // Try ChakraHQ Chakra-format (event-based)
      if (!msg && body?.event === "inbound_message") {
        try {
          const data = body.data || body;
          msg = {
            from: data.from || data.phone_number || "",
            name: data.contact_name || data.from || "",
            type: data.type || "text",
            text: data.text?.body || data.message || data.text || "",
            timestamp: data.timestamp || String(Date.now() / 1000),
            messageId: data.message_id || data.id || `chakra_${Date.now()}`,
          };
          if (!msg.from || !msg.text) msg = null;
        } catch {
          msg = null;
        }
      }

      if (msg) {
        console.log(`[recv] ${msg.type} from ${msg.name} (${msg.from}): ${msg.text.substring(0, 80)}`);
        markAsRead(msg.messageId);
        enqueueMessage(msg);
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[donna-webhook] running on http://localhost:${server.port}`);
console.log(`[donna-webhook] PHONE_ID: ${PHONE_ID}`);
console.log(`[donna-webhook] Bridge: Meta → OpenClaw Agent CLI → Cloud API`);
console.log(`[donna-webhook] HMAC validation: ${APP_SECRET ? "enabled" : "DISABLED (no APP_SECRET)"}`);
console.log(`[donna-webhook] Agent timeout: ${AGENT_TIMEOUT}s`);
console.log(`[donna-webhook] Debounce: ${DEBOUNCE_MS}ms (${DEBOUNCE_MS / 1000}s)`);
