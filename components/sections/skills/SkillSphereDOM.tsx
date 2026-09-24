"use client";

import { useAnimationFrame, useReducedMotion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { SKILLS_SPHERE } from "@/config/motion";
import { skills } from "@/content/skills";
import { useMounted } from "@/hooks/useMounted";
import { fibonacciSphere } from "@/lib/fibonacci";
import { useScrollContext } from "@/providers/ScrollProvider";
import { groupColor, groupHue, hueStyle } from "./cluster";

/**
 * The fallback for the constellation (no WebGL, low-end, reduced motion):
 * pills on a Fibonacci sphere, projected to the plane in a rAF loop (direct
 * DOM writes, no React renders). Rotation speed = idle + |scroll velocity|.
 */
export function SkillSphereDOM() {
  // Gated behind mount: the pause control is conditional on this, and the
  // server can't know the user's motion preference.
  const mounted = useMounted();
  const reduced = (useReducedMotion() ?? false) && mounted;
  const { velocity } = useScrollContext();
  const points = useMemo(() => fibonacciSphere(skills.length), []);
  const refs = useRef<(HTMLLIElement | null)[]>([]);
  const angle = useRef(0);
  const tilt = useRef(0.35);
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);
  const [radius, setRadius] = useState<number>(SKILLS_SPHERE.radius);

  useEffect(() => {
    const fit = () => setRadius(Math.min(SKILLS_SPHERE.radius, window.innerWidth * 0.36));
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, []);

  useAnimationFrame((_, deltaMs) => {
    const dt = Math.min(deltaMs, 50) / 1000;
    // Auto-rotation stops on hover/focus, on the pause control, and under reduced motion.
    if (!reduced && !paused && hovered === null) {
      const v = Math.abs(velocity.get());
      const speed = Math.min(SKILLS_SPHERE.maxSpeed, SKILLS_SPHERE.baseSpeed + v * SKILLS_SPHERE.velocityGain);
      angle.current += speed * dt;
    }
    const a = angle.current;
    const ca = Math.cos(a), sa = Math.sin(a);
    const ct = Math.cos(tilt.current), st = Math.sin(tilt.current);

    for (let i = 0; i < points.length; i++) {
      const el = refs.current[i];
      if (!el) continue;
      const p = points[i];
      // rotate around Y, then tilt around X
      const x1 = p.x * ca + p.z * sa;
      const z1 = -p.x * sa + p.z * ca;
      const y1 = p.y * ct - z1 * st;
      const z2 = p.y * st + z1 * ct;
      const depth = (z2 + 1) / 2; // 0 back … 1 front
      const isHover = hovered === i;
      const dim = hovered !== null && !isHover;
      const scale = (0.7 + depth * 0.5) * (isHover ? SKILLS_SPHERE.hoverPop : 1);
      el.style.transform = `translate(-50%, -50%) translate3d(${(x1 * radius).toFixed(1)}px, ${(y1 * radius).toFixed(1)}px, 0) scale(${scale.toFixed(3)})`;
      el.style.opacity = isHover ? "1" : String((dim ? SKILLS_SPHERE.dimOthers : 1) * (0.35 + depth * 0.65));
      el.style.zIndex = String(Math.round(depth * 100) + (isHover ? 200 : 0));
    }
  });

  return (
    <div
      className="relative mx-auto mt-12 aspect-square w-full max-w-[600px]"
      style={{ perspective: 900 }}
      onPointerLeave={() => setHovered(null)}
    >
      {!reduced && (
        <button
          type="button"
          onClick={() => setPaused((p) => !p)}
          aria-pressed={paused}
          aria-label={paused ? "Resume rotation" : "Pause rotation"}
          className="ring-btn absolute right-0 top-0 z-[300] inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg text-fg-muted"
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l14 8-14 8z" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
          )}
        </button>
      )}
      <ul className="absolute inset-0" aria-label="Skills">
        {skills.map((s, i) => (
          <li
            key={`${s.name}-${i}`}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="absolute left-1/2 top-1/2 will-change-transform"
            style={{ opacity: 0 }}
          >
            <button
              type="button"
              onPointerEnter={() => setHovered(i)}
              onFocus={() => setHovered(i)}
              onBlur={() => setHovered(null)}
              className="whitespace-nowrap rounded-full border border-line bg-bg px-3.5 py-1.5 text-fg transition-[color,border-color,background-color,box-shadow] duration-(--dur-hover) ease-(--ease-out)"
              style={{
                fontSize: s.weight === 3 ? "var(--text-base)" : s.weight === 2 ? "var(--text-sm)" : "var(--text-xs)",
                ...(hovered === i ? hueStyle(groupHue[s.group]) : null),
              }}
            >
              <span
                aria-hidden
                className="mr-2 inline-block h-1.5 w-1.5 rounded-full align-middle transition-colors duration-(--dur-hover)"
                style={{ background: hovered === i ? groupHue[s.group] : groupColor[s.group] }}
              />
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
