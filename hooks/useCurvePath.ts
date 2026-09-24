"use client";

import {
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";
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
import { useMounted } from "./useMounted";

export type CurveDirection = "br-tl" | "bl-tr" | "tr-bl" | "tl-br" | "b-t" | "r-l";

export type CurvePathOptions = {
  /** 0 = straight diagonal, 1 = strong arc. Default CURVE_BEND_DEFAULT. */
  bend?: number;
  /** Where the element starts, as a fraction of viewport: x in vw, y in vh. Default { x: 28, y: 22 }. */
  travel?: { x: number; y: number };
  /** Mirrors the arc. Default "br-tl" (bottom-right → top-left). */
  direction?: CurveDirection;
  /** Drive from an external 0→1 value instead of the element's own scroll. */
  progress?: MotionValue<number>;
  /** motion useScroll offset when self-driven. Default ["start end", "center center"]. */
  offset?: SectionOffset;
  /** Stagger for groups: each unit of `index` delays by this fraction of progress. */
  stagger?: number;
  index?: number;
  /** Fraction of the path at which opacity reaches 1. Default CURVE_OPACITY_END. */
  opacityEnd?: number;
  rotate?: [number, number];
  scale?: [number, number];
  z?: [number, number];
};

export type CurvePath = {
  /** 0→1 along the path after stagger. */
  t: MotionValue<number>;
  x: MotionValue<string>;
  y: MotionValue<string>;
  rotateZ: MotionValue<number>;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  z: MotionValue<number>;
  /** Spread onto a motion element: style={curve.style}. */
  style: MotionStyle;
  /** True when motion is replaced by a plain fade. */
  reduced: boolean;
};

const DEFAULT_OFFSET: SectionOffset = ["start end", "center center"];

/**
 * Ride an element along the site's arc. x and y are decoupled by sampling a
 * cubic bezier, so the path is a curve rather than a straight diagonal.
 *
 * Self-driven by default: t=0 when the element's top enters the viewport
 * bottom, t=1 when its centre reaches the viewport centre (sprung). Pass
 * `progress` to drive a group from one value with `stagger`/`index`.
 *
 * The parent needs `perspective` (CURVE_PERSPECTIVE_PX) and the element
 * `transformStyle: preserve-3d` for translateZ to read as depth.
 */
export function useCurvePath(ref: RefObject<HTMLElement | null>, opts: CurvePathOptions = {}): CurvePath {
  const {
    bend = CURVE_BEND_DEFAULT,
    travel = { x: 28, y: 22 },
    direction = "br-tl",
    offset = DEFAULT_OFFSET,
    stagger = 0,
    index = 0,
    opacityEnd = CURVE_OPACITY_END,
    rotate = CURVE_ROTATE_Z,
    scale = CURVE_SCALE,
    z = CURVE_TRANSLATE_Z,
  } = opts;

  // Gated behind mount so SSR and hydration render identical transforms.
  const prefersReduced = useReducedMotion() ?? false;
  const mounted = useMounted();
  const reduced = prefersReduced && mounted;

  // Own scroll progress (unused when `progress` is supplied, but hooks must be unconditional).
  const { scrollYProgress } = useScroll({ target: ref, offset });
  const source = opts.progress ?? scrollYProgress;
  const sprung = useSpring(source, SECTION_SPRING);
  const driven = reduced || opts.progress ? source : sprung;

  // Stagger: shift + stretch so index i starts later but still ends by 1.
  const delay = Math.min(0.9, stagger * index);
  const t = useTransform(driven, (v) => {
    const s = (v - delay) / (1 - delay);
    return s < 0 ? 0 : s > 1 ? 1 : s;
  });

  const controls = useMemo(() => arcControls(bend), [bend]);
  const sign = useMemo(() => {
    switch (direction) {
      case "bl-tr": return { x: -1, y: 1 };
      case "tr-bl": return { x: 1, y: -1 };
      case "tl-br": return { x: -1, y: -1 };
      case "b-t": return { x: 0, y: 1 };
      case "r-l": return { x: 1, y: 0 };
      default: return { x: 1, y: 1 };
    }
  }, [direction]);

  const x = useTransform(t, (v) => {
    if (reduced) return "0vw";
    const p = cubicPoint(v, ...controls);
    return `${(p.x * travel.x * sign.x).toFixed(3)}vw`;
  });
  const y = useTransform(t, (v) => {
    if (reduced) return "0vh";
    const p = cubicPoint(v, ...controls);
    return `${(p.y * travel.y * sign.y).toFixed(3)}vh`;
  });
  const rotateZ = useTransform(t, (v) => (reduced ? 0 : rotate[0] + (rotate[1] - rotate[0]) * v));
  const scaleMv = useTransform(t, (v) => (reduced ? 1 : scale[0] + (scale[1] - scale[0]) * v));
  const zMv = useTransform(t, (v) => (reduced ? 0 : z[0] + (z[1] - z[0]) * v));
  // Reduced motion: present the final readable state immediately (no scroll-linked fade).
  const opacity = useTransform(t, (v) => (reduced ? 1 : Math.min(1, v / Math.max(0.001, opacityEnd))));

  const style = useMemo<MotionStyle>(
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

  return { t, x, y, rotateZ, scale: scaleMv, opacity, z: zMv, style, reduced };
}
