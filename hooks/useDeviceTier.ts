"use client";

import { useSyncExternalStore } from "react";

export type DeviceTier = {
  /** false on the server and during hydration; true once measured. */
  ready: boolean;
  webgl: boolean;
  mobile: boolean;
  lowEnd: boolean;
  reducedMotion: boolean;
};

const SERVER_TIER: DeviceTier = {
  ready: false,
  webgl: false,
  mobile: false,
  lowEnd: false,
  reducedMotion: false,
};

function detectWebGL(): boolean {
  try {
    const c = document.createElement("canvas");
    return !!(c.getContext("webgl2") || c.getContext("webgl"));
  } catch {
    return false;
  }
}

/* ---- module-level store: measured once, re-measured on media-query change ---- */
let cached: DeviceTier | null = null;
const listeners = new Set<() => void>();
let mqs: MediaQueryList[] | null = null;

function measure(): DeviceTier {
  const nav = navigator as Navigator & { deviceMemory?: number };
  const [mobileMq, rmMq] = mqs!;
  return {
    ready: true,
    webgl: detectWebGL(),
    mobile: mobileMq.matches,
    lowEnd: (nav.hardwareConcurrency ?? 8) <= 4 || (nav.deviceMemory ?? 8) <= 4,
    reducedMotion: rmMq.matches,
  };
}

function ensureMqs() {
  if (!mqs) {
    mqs = [
      window.matchMedia("(max-width: 768px), (pointer: coarse)"),
      window.matchMedia("(prefers-reduced-motion: reduce)"),
    ];
  }
  return mqs;
}

function getSnapshot(): DeviceTier {
  if (!cached) {
    ensureMqs();
    cached = measure();
  }
  return cached;
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  const onChange = () => {
    cached = measure();
    listeners.forEach((l) => l());
  };
  const list = ensureMqs();
  list.forEach((m) => m.addEventListener("change", onChange));
  return () => {
    listeners.delete(cb);
    list.forEach((m) => m.removeEventListener("change", onChange));
  };
}

/**
 * Cheap capability sniff: the skills constellation needs WebGL and some
 * headroom, the stage skips its pointer parallax on touch. SSR-safe: `ready`
 * is false until the client snapshot exists.
 */
export function useDeviceTier(): DeviceTier {
  return useSyncExternalStore(subscribe, getSnapshot, () => SERVER_TIER);
}
