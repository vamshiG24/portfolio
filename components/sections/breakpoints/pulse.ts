/**
 * The heartbeat monitor under the breakpoints. The trace is a pure function
 * of run position u, so scrolling scrubs it both ways: a steady PQRST rhythm,
 * fibrillation while the challenge is up, a flatline while the fix is written,
 * a defibrillator spike as it lands, then the rhythm again.
 */

import { BREAKPOINT_RUN } from "@/config/motion";
import { lerp } from "@/lib/rig";
import { ramp, stateAt, type BpState } from "./timeline";

const { beat, window: span, head, amp } = BREAKPOINT_RUN.pulse;
const P = BREAKPOINT_RUN.phase;

const hash = (n: number) => {
  const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};
const bump = (x: number, c: number, w: number) => Math.exp(-((x - c) ** 2) / (2 * w * w));

/** One P wave, QRS spike and T wave per beat. */
function healthy(u: number) {
  const f = (((u / beat) % 1) + 1) % 1;
  return 0.12 * bump(f, 0.18, 0.03) - 0.2 * bump(f, 0.36, 0.01) + bump(f, 0.4, 0.012) - 0.34 * bump(f, 0.44, 0.012) + 0.24 * bump(f, 0.66, 0.05);
}

/** Fibrillation: fast irregular swings and the odd wild spike. */
function erratic(u: number) {
  const n = Math.floor(u * 140);
  const spike = hash(n) > 0.82 ? (hash(n + 7) - 0.5) * 2.2 * Math.sin(((u * 140) % 1) * Math.PI) : 0;
  return 0.38 * Math.sin(u * 290) * Math.sin(u * 41 + 1.3) + 0.22 * Math.sin(u * 530 + 2.1) + spike;
}

/** Trace value (up is positive, ~−1…1.8) and state at run position u. */
export function signal(u: number, count: number): { v: number; state: BpState } {
  if (u < 0 || u >= count) return { v: healthy(u), state: "running" };
  const s = u - Math.floor(u);
  const state = stateAt(s);
  switch (state) {
    case "exception": {
      const wild = lerp(healthy(u), erratic(u), ramp(P.exception, P.flatline - 0.06, s));
      return { v: wild * (1 - ramp(P.flatline - 0.03, P.flatline, s)), state };
    }
    case "flatline":
    case "patching":
      return { v: 0.012 * Math.sin(u * 900), state };
    case "restart": {
      const q = ramp(P.shock, P.resolved, s);
      return { v: Math.sin(q * Math.PI * 3) * Math.pow(1 - q, 1.5) * 1.8, state };
    }
    default:
      return { v: healthy(u), state };
  }
}

export type PulseColors = Record<BpState, string> & { grid: string };

/**
 * Draw the monitor for run position u into a (w × h CSS px) context. History
 * runs to the left of the write head and fades out; returns the head's point.
 */
export function drawPulse(ctx: CanvasRenderingContext2D, w: number, h: number, u: number, count: number, colors: PulseColors) {
  ctx.clearRect(0, 0, w, h);
  const headX = w * head;
  const pxPerU = headX / span;
  const base = h * 0.62;
  const a = h * amp;

  // Paper: vertical rules riding with the trace, and the baseline.
  ctx.fillStyle = colors.grid;
  const cell = 28;
  for (let x = headX - ((u * pxPerU) % cell); x > 0; x -= cell) ctx.fillRect(Math.round(x), base - a * 1.6, 1, a * 2.6);
  ctx.fillRect(0, Math.round(base), headX, 1);

  // The trace, split into runs by state so each takes its colour.
  const runs: { state: BpState; pts: number[] }[] = [];
  let hx = headX;
  let hy = base;
  let hs: BpState = "running";
  for (let x = 0; x <= headX + 0.5; x += 2) {
    const { v, state } = signal(u - (headX - x) / pxPerU, count);
    const y = base - v * a;
    const run = runs[runs.length - 1];
    if (!run || run.state !== state) {
      const pts = run ? run.pts.slice(-2) : [];
      runs.push({ state, pts: [...pts, x, y] });
    } else run.pts.push(x, y);
    hx = x;
    hy = y;
    hs = state;
  }

  ctx.lineJoin = "round";
  ctx.lineCap = "round";
  for (const [width, alpha] of [
    [6, 0.16],
    [1.6, 1],
  ] as const) {
    ctx.lineWidth = width;
    ctx.globalAlpha = alpha;
    for (const run of runs) {
      ctx.strokeStyle = colors[run.state];
      ctx.beginPath();
      for (let i = 0; i < run.pts.length; i += 2) {
        if (i === 0) ctx.moveTo(run.pts[i], run.pts[i + 1]);
        else ctx.lineTo(run.pts[i], run.pts[i + 1]);
      }
      ctx.stroke();
    }
  }
  ctx.globalAlpha = 1;

  // Older signal fades out to the left.
  ctx.globalCompositeOperation = "destination-in";
  const fade = ctx.createLinearGradient(0, 0, headX * 0.6, 0);
  fade.addColorStop(0, "rgba(0,0,0,0)");
  fade.addColorStop(1, "rgba(0,0,0,1)");
  ctx.fillStyle = fade;
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";

  return { x: hx, y: hy, state: hs };
}
