"use client";

import Lenis from "lenis";
import {
  cancelFrame,
  frame,
  type FrameData,
  type MotionValue,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useVelocity,
} from "motion/react";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
  type RefObject,
} from "react";
import { LENIS_LERP, SCROLL_SPRING } from "@/config/motion";

export type ScrollContextValue = {
  /** Raw 0→1 page progress straight from motion's useScroll (no smoothing). */
  scrollYProgress: MotionValue<number>;
  /** Same value run through SCROLL_SPRING — use this for anything visual. */
  progress: MotionValue<number>;
  /** Raw scrollY in px. */
  scrollY: MotionValue<number>;
  /** px/s, derived from scrollY. Positive = scrolling down. */
  velocity: MotionValue<number>;
  /** Lenis instance, for scrollTo() etc. Null on the server / before mount. */
  lenis: RefObject<Lenis | null>;
  /** prefers-reduced-motion. Consumers swap motion for fades when true. */
  reducedMotion: boolean;
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
  const lenisRef = useRef<Lenis | null>(null);
  const reduced = useReducedMotion() ?? false;

  const { scrollYProgress, scrollY } = useScroll();
  const sprung = useSpring(scrollYProgress, SCROLL_SPRING);
  const velocity = useVelocity(scrollY);

  // Under reduced motion the spring is bypassed so there is no lag at all.
  const progress = reduced ? scrollYProgress : sprung;

  useEffect(() => {
    const lenis = new Lenis({
      lerp: LENIS_LERP,
      smoothWheel: true,
      anchors: true, // in-page #links scroll smoothly
      respectReducedMotion: true, // lerp → 1 when the OS asks for it
    });
    lenisRef.current = lenis;

    const tick = ({ timestamp }: FrameData) => lenis.raf(timestamp);
    frame.setup(tick, true);

    return () => {
      cancelFrame(tick);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // MotionValues are stable across renders, so this only changes with `reduced`.
  const value = useMemo<ScrollContextValue>(
    () => ({
      scrollYProgress,
      progress,
      scrollY,
      velocity,
      lenis: lenisRef,
      reducedMotion: reduced,
    }),
    [scrollYProgress, progress, scrollY, velocity, reduced],
  );

  return (
    <ScrollContext.Provider value={value}>
      {children}
    </ScrollContext.Provider>
  );
}

export function useScrollContext(): ScrollContextValue {
  const ctx = useContext(ScrollContext);
  if (!ctx) throw new Error("useScrollContext must be used inside <ScrollProvider>");
  return ctx;
}

/** Convenience: a MotionValue that is always 0, for components rendered outside the provider (tests, MDX previews). */
export function useZeroMotionValue() {
  return useMotionValue(0);
}
