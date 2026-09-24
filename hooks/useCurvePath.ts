"use client";

import { useReducedMotion, useScroll, useSpring, useTransform, type MotionStyle } from "motion/react";
import { useMemo, type RefObject } from "react";
import {
  CURVE_BEND_DEFAULT,
  CURVE_OPACITY_END,
  CURVE_ROTATE_Z,
  CURVE_SCALE,
  CURVE_TRANSLATE_Z,
  SECTION_SPRING,
  type SectionOffset,
} from "@/config/motion";
import { arcControls, cubicPoint } from "@/lib/bezier";
import { clamp } from "@/lib/rig";
import { useMounted } from "./useMounted";

export type CurvePathOptions = {
  /** 0 = straight diagonal, 1 = strong arc. Default CURVE_BEND_DEFAULT. */
  bend?: number;
  /** Where the element starts, as a fraction of viewport: x in vw, y in vh. Default { x: 28, y: 22 }. */
  travel?: { x: number; y: number };
  /** Which corner it arrives from: bottom-right (default) or bottom-left. */
  direction?: "br-tl" | "bl-tr";
  /** motion useScroll offset. Default ["start end", "center center"]. */
  offset?: SectionOffset;
  rotate?: [number, number];
  scale?: [number, number];
  z?: [number, number];
};

const DEFAULT_OFFSET: SectionOffset = ["start end", "center center"];

/**
 * Ride an element along the site's arc. x and y are decoupled by sampling a
 * cubic bezier, so the path is a curve rather than a straight diagonal.
 *
 * t=0 when the element's top enters the viewport bottom, t=1 when its centre
 * reaches the viewport centre (sprung). Returns the style to spread onto a
 * motion element; under reduced motion that style is the resting state.
 *
 * The parent needs `perspective` (CURVE_PERSPECTIVE_PX) for translateZ to read as depth.
 */
export function useCurvePath(ref: RefObject<HTMLElement | null>, opts: CurvePathOptions = {}): MotionStyle {
  const {
    bend = CURVE_BEND_DEFAULT,
    travel = { x: 28, y: 22 },
    direction = "br-tl",
    offset = DEFAULT_OFFSET,
    rotate = CURVE_ROTATE_Z,
    scale = CURVE_SCALE,
    z = CURVE_TRANSLATE_Z,
  } = opts;

  // Gated behind mount so SSR and hydration render identical transforms.
  const prefersReduced = useReducedMotion() ?? false;
  const mounted = useMounted();
  const reduced = prefersReduced && mounted;

  const { scrollYProgress } = useScroll({ target: ref, offset });
  const sprung = useSpring(scrollYProgress, SECTION_SPRING);
  // The spring can overshoot: the path itself runs 0 → 1 and stops.
  const t = useTransform(reduced ? scrollYProgress : sprung, (v) => clamp(v, 0, 1));

  const controls = useMemo(() => arcControls(bend), [bend]);
  const sx = direction === "bl-tr" ? -1 : 1;

  const x = useTransform(t, (v) => (reduced ? "0vw" : `${(cubicPoint(v, ...controls).x * travel.x * sx).toFixed(3)}vw`));
  const y = useTransform(t, (v) => (reduced ? "0vh" : `${(cubicPoint(v, ...controls).y * travel.y).toFixed(3)}vh`));
  const rotateZ = useTransform(t, (v) => (reduced ? 0 : rotate[0] + (rotate[1] - rotate[0]) * v));
  const scaleMv = useTransform(t, (v) => (reduced ? 1 : scale[0] + (scale[1] - scale[0]) * v));
  const zMv = useTransform(t, (v) => (reduced ? 0 : z[0] + (z[1] - z[0]) * v));
  // Reduced motion: present the final readable state immediately (no scroll-linked fade).
  const opacity = useTransform(t, (v) => (reduced ? 1 : Math.min(1, v / CURVE_OPACITY_END)));

  return useMemo<MotionStyle>(
    () => ({
      x,
      y,
      rotateZ,
      scale: scaleMv,
      z: zMv,
      opacity,
      transformStyle: "preserve-3d",
      willChange: "transform, opacity",
    }),
    [x, y, rotateZ, scaleMv, zMv, opacity],
  );
}
