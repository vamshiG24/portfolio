import { BREAKPOINT_RUN } from "@/config/motion";
import { clamp } from "@/lib/rig";

const P = BREAKPOINT_RUN.phase;

/** 0 → 1 as x crosses [a, b]; linear, clamped. */
export const ramp = (a: number, b: number, x: number) => clamp((x - a) / (b - a), 0, 1);

export type BpState = "running" | "exception" | "flatline" | "patching" | "restart" | "resolved";

/** What one breakpoint is doing at s, its progress through its own stretch of scroll. */
export function stateAt(s: number): BpState {
  if (s < P.exception) return "running";
  if (s < P.flatline) return "exception";
  if (s < P.morph[0]) return "flatline";
  if (s < P.shock) return "patching";
  if (s < P.resolved) return "restart";
  return "resolved";
}

/** The breakpoint on stage at run position u (0 → count), and how far through it. */
export function locate(u: number, count: number) {
  const k = clamp(Math.floor(u), 0, count - 1);
  return { k, s: u - k };
}

/** The monitor's readout per state. */
export const STATUS: Record<BpState, string> = {
  running: "running",
  exception: "exception thrown",
  flatline: "flatline",
  patching: "patching",
  restart: "restarting",
  resolved: "resolved",
};
