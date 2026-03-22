/**
 * Donna WhatsApp Cloud API Webhook Server
 *
 * Bun-native server — zero external dependencies.
 * Receives WhatsApp messages via Meta Cloud API webhook,
 * validates HMAC signatures, and forwards to OpenClaw.
 */

// --- Config ---

const PORT = Number(Bun.env.WEBHOOK_PORT) || 3001;
const VERIFY_TOKEN = Bun.env.WHATSAPP_VERIFY_TOKEN ?? "";
const APP_SECRET = Bun.env.WHATSAPP_APP_SECRET ?? "";
const API_TOKEN = Bun.env.WHATSAPP_API_TOKEN ?? "";
const PHONE_ID = Bun.env.WHATSAPP_PHONE_ID ?? "";
const OPENCLAW_URL = Bun.env.OPENCLAW_API_URL ?? "http://localhost:18789/api/v1/agent/message";
const OPENCLAW_AUTH = Bun.env.OPENCLAW_AUTH_TOKEN ?? "";
const GRAPH_API = `https://graph.facebook.com/v21.0/${PHONE_ID}/messages`;

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

// --- Forward to OpenClaw ---

async function forwardToOpenClaw(msg: ExtractedMessage): Promise<void> {
  const payload = {
    message: msg.text,
    metadata: {
      channel: "whatsapp",
      from: msg.from,
      name: msg.name,
      type: msg.type,
      messageId: msg.messageId,
      timestamp: msg.timestamp,
      ...(msg.mediaId && { mediaId: msg.mediaId }),
      ...(msg.mimeType && { mimeType: msg.mimeType }),
      ...(msg.latitude != null && { latitude: msg.latitude }),
      ...(msg.longitude != null && { longitude: msg.longitude }),
    },
  };

  try {
    const resp = await fetch(OPENCLAW_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(OPENCLAW_AUTH && { Authorization: `Bearer ${OPENCLAW_AUTH}` }),
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      console.error(`[openclaw] ${resp.status} ${resp.statusText}`);
      const text = await resp.text().catch(() => "");
      if (text) console.error(`[openclaw] body: ${text}`);
    } else {
      console.log(`[openclaw] forwarded msg from ${msg.name} (${msg.from})`);
    }
  } catch (e) {
    console.error("[openclaw] fetch failed:", e);
  }
}

// --- Send WhatsApp message via Cloud API ---

export async function sendWhatsApp(to: string, text: string): Promise<boolean> {
  try {
    const resp = await fetch(GRAPH_API, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_TOKEN}`,
        "Content-Type": "application/json",
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
      console.error(`[send] ${resp.status}: ${err}`);
      return false;
    }

    console.log(`[send] message sent to ${to}`);
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

    // Webhook messages (Meta POST)
    if (req.method === "POST" && (url.pathname === "/webhook" || url.pathname === "/")) {
      const rawBody = await req.text();

      // Validate HMAC signature
      const signature = req.headers.get("x-hub-signature-256");
      const valid = await validateSignature(rawBody, signature);
      if (!valid) {
        console.warn("[hmac] invalid signature — rejecting");
        return new Response("Unauthorized", { status: 401 });
      }

      // Respond 200 immediately (Meta requires < 5s)
      // Process asynchronously
      const body = JSON.parse(rawBody);
      const msg = extractMessage(body);

      if (msg) {
        console.log(`[recv] ${msg.type} from ${msg.name} (${msg.from}): ${msg.text.substring(0, 80)}`);
        // Fire-and-forget: forward + mark as read
        forwardToOpenClaw(msg);
        markAsRead(msg.messageId);
      }

      return new Response("OK", { status: 200 });
    }

    return new Response("Not Found", { status: 404 });
  },
});

console.log(`[donna-webhook] running on http://localhost:${server.port}`);
console.log(`[donna-webhook] PHONE_ID: ${PHONE_ID}`);
console.log(`[donna-webhook] OPENCLAW: ${OPENCLAW_URL}`);
console.log(`[donna-webhook] HMAC validation: ${APP_SECRET ? "enabled" : "DISABLED (no APP_SECRET)"}`);
