"use client";

import { useReducedMotion, useScroll, useSpring, type MotionValue } from "motion/react";
import type { RefObject } from "react";
import { SECTION_OFFSET, SECTION_SPRING, type SectionOffset } from "@/config/motion";

export type SectionProgress = {
  /** 0→1 as the section crosses the viewport (see SECTION_OFFSET). Unsmoothed. */
  raw: MotionValue<number>;
  /** Sprung version — drives visuals. Identical to `raw` under reduced motion. */
  progress: MotionValue<number>;
};

type Options = {
  /** motion `useScroll` offset. Default: ["start end", "end start"]. */
  offset?: SectionOffset;
};

/**
 * Per-section scroll progress. Pass the section's ref; get a MotionValue that
 * runs 0→1 while the section is travelling through the viewport.
 */
export function useSectionProgress(
  ref: RefObject<HTMLElement | null>,
  opts: Options = {},
): SectionProgress {
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: opts.offset ?? SECTION_OFFSET,
  });
  const sprung = useSpring(scrollYProgress, SECTION_SPRING);
  return { raw: scrollYProgress, progress: reduced ? scrollYProgress : sprung };
}
