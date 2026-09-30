/**
 * The challenge text turning into the solution text, one particle per lit
 * pixel. Both texts are sampled from the page as rendered (same font, same
 * line breaks), so at t = 0 the particles sit exactly on the challenge's
 * glyphs and at t = 1 on the solution's. They leave in reading order, squeeze
 * through the gate between the two, and land in reading order, so the fix
 * writes itself out of the bug. Drawing is a pure function of t: scrubbing
 * back re-breaks it.
 */

import { BREAKPOINT_RUN } from "@/config/motion";
import { clamp } from "@/lib/rig";

type Pt = { x: number; y: number; r: number };

const hash = (n: number) => {
  const x = Math.sin(n * 91.7 + 17.3) * 43758.5453;
  return x - Math.floor(x);
};
const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

/**
 * Lit pixels of a text element (every `step` px), relative to `origin`, sorted
 * in reading order (r: 0 at the first word, 1 at the last).
 */
export function sampleText(el: HTMLElement, origin: DOMRect, step: number): Pt[] {
  const box = el.getBoundingClientRect();
  const w = Math.ceil(box.width);
  const h = Math.ceil(box.height);
  if (!w || !h) return [];

  const off = document.createElement("canvas");
  off.width = w;
  off.height = h;
  const ctx = off.getContext("2d", { willReadFrequently: true });
  if (!ctx) return [];
  const cs = getComputedStyle(el);
  ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
  ctx.fillStyle = "#fff";
  // A word's range box is the font's content area, so the baseline sits one font ascent below its top.
  const ascent = ctx.measureText("Hg").fontBoundingBoxAscent;
  const exact = Number.isFinite(ascent) && ascent > 0;
  ctx.textBaseline = exact ? "alphabetic" : "middle";

  // Draw each word where the page put it, so the line breaks match.
  const range = document.createRange();
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    for (const m of (node.textContent ?? "").matchAll(/\S+/g)) {
      range.setStart(node, m.index);
      range.setEnd(node, m.index + m[0].length);
      const r = range.getClientRects()[0];
      if (r) ctx.fillText(m[0], r.left - box.left, r.top - box.top + (exact ? ascent : r.height / 2));
    }
  }

  const data = ctx.getImageData(0, 0, w, h).data;
  const lineH = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.5;
  const lines = Math.max(1, Math.round(h / lineH));
  const pts: Pt[] = [];
  for (let y = 0; y < h; y += step) {
    const line = Math.min(lines - 1, Math.floor(y / lineH));
    for (let x = 0; x < w; x += step) {
      if (data[(y * w + x) * 4 + 3] > 110) {
        pts.push({ x: box.left - origin.left + x, y: box.top - origin.top + y, r: (line + x / w) / lines });
      }
    }
  }
  return pts.sort((a, b) => a.r - b.r);
}

/** `n` CSS colours evenly through the given 6-digit hex stops. */
export function palette(stops: string[], n: number): string[] {
  const rgb = stops.map((hex) => {
    const c = hex.replace("#", "");
    return [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) || 0);
  });
  return Array.from({ length: n }, (_, i) => {
    const f = (i / (n - 1)) * (rgb.length - 1);
    const j = Math.min(rgb.length - 2, Math.floor(f));
    const t = f - j;
    const [r, g, b] = rgb[j].map((v, k) => Math.round(v + (rgb[j + 1][k] - v) * t));
    return `rgb(${r}, ${g}, ${b})`;
  });
}

export class TextMorph {
  private readonly n: number;
  private readonly ax: Float32Array;
  private readonly ay: Float32Array;
  private readonly bx: Float32Array;
  private readonly by: Float32Array;
  private readonly cx: Float32Array;
  private readonly cy: Float32Array;
  private readonly seed: Float32Array;
  private readonly px: Float32Array;
  private readonly py: Float32Array;
  private readonly ps: Float32Array;
  private readonly tone: Uint8Array;

  /** Pairs the two point sets in reading order; each flight bends through a point near `gate`. */
  constructor(from: Pt[], to: Pt[], gate: { x: number; y: number }, cap: number) {
    const n = from.length && to.length ? Math.min(cap, Math.max(from.length, to.length)) : 0;
    this.n = n;
    const f = () => new Float32Array(n);
    this.ax = f();
    this.ay = f();
    this.bx = f();
    this.by = f();
    this.cx = f();
    this.cy = f();
    this.seed = f();
    this.px = f();
    this.py = f();
    this.ps = f();
    this.tone = new Uint8Array(n);
    const { funnel } = BREAKPOINT_RUN.particles;
    for (let i = 0; i < n; i++) {
      const a = from[Math.floor((i * from.length) / n)];
      const b = to[Math.floor((i * to.length) / n)];
      const s = hash(i);
      const angle = s * Math.PI * 2;
      const radius = funnel * Math.sqrt(hash(i + 0.5));
      this.ax[i] = a.x;
      this.ay[i] = a.y;
      this.bx[i] = b.x;
      this.by[i] = b.y;
      this.cx[i] = gate.x + Math.cos(angle) * radius;
      this.cy[i] = gate.y + Math.sin(angle) * radius;
      this.seed[i] = s;
    }
  }

  /** Draw at morph progress t (0 → 1) with overall opacity `alpha`; `tones` runs challenge colour → solution colour. */
  draw(ctx: CanvasRenderingContext2D, t: number, alpha: number, tones: string[]) {
    const { stagger, size, flare, swirl } = BREAKPOINT_RUN.particles;
    const n = this.n;
    const last = tones.length - 1;
    for (let i = 0; i < n; i++) {
      const lt = clamp((t - (i / n) * stagger) / (1 - stagger), 0, 1);
      const e = easeInOutCubic(lt);
      const m = 1 - e;
      // Cubic with both controls at the funnel point: the path squeezes through the gate.
      const k = 3 * m * e;
      const s = this.seed[i];
      const lift = Math.sin(Math.PI * e);
      this.px[i] = m * m * m * this.ax[i] + k * this.cx[i] + e * e * e * this.bx[i] + Math.cos(s * 6.283 + e * 9) * swirl * lift;
      this.py[i] = m * m * m * this.ay[i] + k * this.cy[i] + e * e * e * this.by[i] + Math.sin(s * 6.283 + e * 7) * swirl * lift;
      this.ps[i] = size * (1 + flare * lift);
      this.tone[i] = Math.round(e * last);
    }

    ctx.globalAlpha = alpha;
    ctx.globalCompositeOperation = "lighter";
    for (let c = 0; c <= last; c++) {
      ctx.fillStyle = tones[c];
      for (let i = 0; i < n; i++) {
        if (this.tone[i] !== c) continue;
        const d = this.ps[i];
        ctx.fillRect(this.px[i] - d / 2, this.py[i] - d / 2, d, d);
      }
    }
    ctx.globalCompositeOperation = "source-over";
    ctx.globalAlpha = 1;
  }
}
