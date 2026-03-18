#!/usr/bin/env bun

/**
 * Donna Dashboard Server
 * Serve o painel executivo + proxy para Notion API (resolve CORS)
 *
 * Uso: bun dashboard/serve.js
 * Acesso: http://localhost:3333
 */

import { readFileSync } from "node:fs";
import { join, extname } from "node:path";

const PORT = 3333;
const DIR = import.meta.dir;
const NOTION_TOKEN = readFileSync(join(process.env.HOME, ".config/notion/api_key"), "utf-8").trim();

const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

Bun.serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);

    // Notion proxy (resolve CORS)
    if (url.pathname.startsWith("/notion/")) {
      const notionPath = url.pathname.replace("/notion/", "");
      const notionUrl = `https://api.notion.com/v1/${notionPath}`;

      const body = req.method === "POST" ? await req.text() : undefined;

      const res = await fetch(notionUrl, {
        method: req.method,
        headers: {
          "Authorization": `Bearer ${NOTION_TOKEN}`,
          "Notion-Version": "2022-06-28",
          "Content-Type": "application/json",
        },
        body,
      });

      const data = await res.text();
      return new Response(data, {
        status: res.status,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    // Static files
    let filePath = url.pathname === "/" ? "/index.html" : url.pathname;
    try {
      const content = readFileSync(join(DIR, filePath));
      const ext = extname(filePath);
      return new Response(content, {
        headers: { "Content-Type": MIME[ext] || "application/octet-stream" },
      });
    } catch {
      return new Response("Not Found", { status: 404 });
    }
  },
});

console.log(`\n  Donna Dashboard: http://localhost:${PORT}\n`);
