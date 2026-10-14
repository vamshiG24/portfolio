# Gowni Vamshi — portfolio

Next.js 16 (App Router, Turbopack), Tailwind v4, `motion`, Lenis, and a small three.js scene.

```bash
npm run dev     # http://localhost:3000
npm run build
npm run lint
```

## How it is put together

- **The stage** — `components/background/stage/VideoStage.tsx`. One fixed layer behind the whole page: the intro clip is scrubbed by the hero's scroll, the figure is then carried into the About section's plate, the portrait stays dark until hovered and a pointer spotlight reveals it through the figure, and a pre-blurred plate sits under the later sections.
- **Sections** — `components/sections/*`; the skills constellation is `sections/skills/*` (WebGL, with a DOM sphere fallback).
- **Content** — `content/` (site copy, skills, timeline, projects and build logs as MDX). A log whose frontmatter has `challenge` and `solution` also appears in the home page's Breakpoints section.
- **Tunables** — every number lives in `config/motion.ts`; colours in `styles/tokens.css`.

## Personal AI

The chat in the hero's bottom-right corner (`components/chat/PersonalAI.tsx`) talks to a small Python server, `ai/server.py` (FastAPI + Google's `google-genai` SDK, Gemini free tier). It only talks about who Vamshi is and Vamshi's work, from the site's own `content/` files (read at startup, so editing the content updates what it knows), and hands out the GitHub, LinkedIn, email and project links. Next.js proxies `/api/chat` to it (`next.config.ts`). It tries `gemini-3.8-flash` first and falls back to `gemini-3.5-flash-lite` when that model's free quota runs out.

```bash
cd ai
python -m venv .venv
.venv\Scripts\activate          # macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn server:app --port 8000 --reload
```

Put `GEMINI_API_KEY=...` in `ai/.env` (git-ignored); get a free key at https://aistudio.google.com/apikey. Free-tier limits are shown in AI Studio, and Google may use free-tier prompts to improve its products. Without the server or a key, the chat still opens and says it's offline, with your email. In production, deploy `ai/` anywhere that runs Python, start it with `--forwarded-allow-ips="*"` so the per-visitor rate limit works behind the proxy, and set `AI_SERVER_URL` for the Next.js build.

## Assets

Everything served is in `public/`:

- `public/video/intro*.{mp4,jpg}` — the intro clip, encoded for scrubbing (`keyint=4`, no B-frames, `+faststart`; see `INTRO` in `config/motion.ts`).
- `public/myimage/about-reveal.png` — the portrait cut out and composited into the clip's frame space; `vamshi-thumb.jpg` for the About card.
- `app/icon.svg` — the favicon; the same mark as `components/layout/BrandMark.tsx`.
