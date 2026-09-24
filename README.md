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

## Assets

Served files are in `public/`; their sources are in `assets/` (not deployed):

- `public/video/intro*.{mp4,jpg}` from `assets/video/…mp4` — re-encode with `keyint=4`, no B-frames, `+faststart` (flags documented on `INTRO` in `config/motion.ts`).
- `public/myimage/about-reveal.png` — the portrait cut out and composited into the clip's frame space; `vamshi-thumb.jpg` for the About card. Source: `assets/photo/`.
