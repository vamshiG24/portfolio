"use client";

import { motionValue } from "motion/react";

/**
 * Tiny channel from the hero into the stage. <Home> writes, <VideoStage>
 * reads. MotionValues so writes never cause React renders.
 */
export const bgStore = {
  /** 0→1 as the intro hero scrolls through. */
  heroProgress: motionValue(0),
  /** 0→1 over the pinned stretch after the intro, as the figure is carried into About. */
  handoff: motionValue(0),
  /** 0→1 footage preload progress (1 = ready to scrub). */
  introLoad: motionValue(0),
};

// Dev aid: inspect the channel from DevTools (`__bgStore`). Stripped in production builds.
if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
  (window as unknown as { __bgStore: typeof bgStore }).__bgStore = bgStore;
}
