import type { NextConfig } from "next";

/** The Python chat server (ai/server.py). Set AI_SERVER_URL wherever it is deployed; read at build time. */
const AI_SERVER_URL = process.env.AI_SERVER_URL ?? "http://127.0.0.1:8000";

const nextConfig: NextConfig = {
  // Same-origin proxy, so the browser never needs CORS or the server's address.
  async rewrites() {
    return [{ source: "/api/chat", destination: `${AI_SERVER_URL}/chat` }];
  },
};

export default nextConfig;
