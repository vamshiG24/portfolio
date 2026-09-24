"use client";

import Lenis from "lenis";
import { cancelFrame, frame, type FrameData, type MotionValue, useScroll, useVelocity } from "motion/react";
import { createContext, useContext, useEffect, useMemo, type ReactNode } from "react";
import { LENIS_LERP } from "@/config/motion";

export type ScrollContextValue = {
  /** Raw scrollY in px. */
  scrollY: MotionValue<number>;
  /** px/s, derived from scrollY. Positive = scrolling down. */
  velocity: MotionValue<number>;
};

const ScrollContext = createContext<ScrollContextValue | null>(null);

/**
 * Lenis v1 drives the *real* document scroll position (no transformed
 * wrapper), so motion's `useScroll` — which listens to native scroll events on
 * document.scrollingElement — reads exactly the value Lenis writes. One source
 * of truth, no custom container needed.
 *
 * Lenis ticks inside motion's own frame loop, in its first step ("setup"), so
 * every frame scrolls first and then measures and renders. On a separate rAF
 * the order of the two loops could flip, and anything drawn from scrollY (the
 * fixed stage following About up) would trail the page by a frame and shimmer.
 */
export function ScrollProvider({ children }: { children: ReactNode }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);

  useEffect(() => {
    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      anchors: true, // in-page #links scroll smoothly
      respectReducedMotion: true, // lerp → 1 when the OS asks for it
    });
    const tick = ({ timestamp }: FrameData) => lenis.raf(timestamp);
    frame.setup(tick, true);

    return () => {
      cancelFrame(tick);
      lenis.destroy();
    };
  }, []);

  // MotionValues are stable across renders, so this never changes.
  const value = useMemo<ScrollContextValue>(() => ({ scrollY, velocity }), [scrollY, velocity]);

  return <ScrollContext.Provider value={value}>{children}</ScrollContext.Provider>;
}

export function useScrollContext(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used inside <ScrollProvider>");
  return ctx;
}
