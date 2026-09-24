"use client";

import { useInView, useReducedMotion } from "motion/react";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { skills, type Skill } from "@/content/skills";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useMounted } from "@/hooks/useMounted";
import { useScrollContext } from "@/providers/ScrollProvider";
import { Section } from "./Section";
import { groupColor, groupHue, hueStyle, type ClusterUI } from "./skills/cluster";
import { SkillSphereDOM } from "./skills/SkillSphereDOM";

// three + R3F only load on clients that get the constellation, and only as it approaches.
const SkillsCanvas = dynamic(() => import("./skills/SkillsCanvas"), { ssr: false });

export function Skills() {
  return (
    <Section id="skills" eyebrow="03 — Skills" title="What I work with">
      <p className="max-w-(--measure) text-fg-muted">
        A constellation, not a list — the things I reach for most burn brightest. Scroll fast and it spins with you; hover a name to
        see what it connects to.
      </p>
      <SkillsCluster />
      <ul className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted" aria-label="Legend">
        {(Object.keys(groupColor) as Skill["group"][]).map((g) => (
          <li key={g} className="flex items-center gap-2">
            <span aria-hidden className="inline-block h-2.5 w-2.5 rounded-full" style={{ background: groupColor[g] }} />
            {g}
          </li>
        ))}
      </ul>
    </Section>
  );
}

/** The constellation needs WebGL and some headroom; no WebGL, low-end and reduced motion get the sphere. */
function SkillsCluster() {
  const tier = useDeviceTier();
  const mounted = useMounted();
  const reduced = (useReducedMotion() ?? false) && mounted;
  if (tier.ready && (!tier.webgl || tier.lowEnd || tier.reducedMotion)) return <SkillSphereDOM />;
  return <Constellation reduced={reduced} />;
}

/**
 * The DOM half of the constellation: the box the canvas fills, the labels the
 * scene positions (real buttons, so every skill is focusable), the pause
 * control, and the pointer/hover/visibility state the scene reads per frame.
 */
function Constellation({ reduced }: { reduced: boolean }) {
  const box = useRef<HTMLDivElement>(null);
  const labels = useRef<(HTMLElement | null)[]>([]);
  const { velocity } = useScrollContext();
  const ui = useRef<ClusterUI>({ hovered: null, paused: false, pointer: { x: 0, y: 0 }, seenAt: null, velocity: () => velocity.get() });
  const [hovered, setHovered] = useState<number | null>(null);
  const [paused, setPaused] = useState(false);

  // Mount ahead of arrival, render only while on screen, assemble once at first real view.
  const near = useInView(box, { margin: "600px 0px 600px 0px" });
  const active = useInView(box, { amount: 0.05 });
  const seen = useInView(box, { amount: 0.3, once: true });
  useEffect(() => {
    if (seen && ui.current.seenAt === null) ui.current.seenAt = performance.now();
  }, [seen]);

  const hover = (i: number | null) => {
    ui.current.hovered = i;
    setHovered(i);
  };
  const onMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    ui.current.pointer = { x: ((e.clientX - r.left) / r.width) * 2 - 1, y: ((e.clientY - r.top) / r.height) * 2 - 1 };
  };
  const onLeave = () => {
    ui.current.pointer = { x: 0, y: 0 };
    hover(null);
  };

  return (
    <div
      ref={box}
      className="relative mx-auto mt-12 aspect-[4/5] w-full max-w-[64rem] sm:aspect-[4/3] md:aspect-[16/10]"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      {near && <SkillsCanvas ui={ui} labels={labels} reduced={reduced} active={active} />}

      {!reduced && (
        <button
          type="button"
          onClick={() => {
            ui.current.paused = !paused;
            setPaused(!paused);
          }}
          aria-pressed={paused}
          aria-label={paused ? "Resume rotation" : "Pause rotation"}
          className="ring-btn absolute right-0 top-0 z-[300] inline-flex h-10 w-10 items-center justify-center rounded-full border border-line bg-bg/80 text-fg-muted"
        >
          {paused ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M7 4l14 8-14 8z" /></svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M6 4h4v16H6zm8 0h4v16h-4z" /></svg>
          )}
        </button>
      )}

      {/* labels: positioned by the scene, beside their stars */}
      <ul className="pointer-events-none absolute inset-0" aria-label="Skills">
        {skills.map((s, i) => (
          <li
            key={`${s.name}-${i}`}
            ref={(el) => {
              labels.current[i] = el;
            }}
            className="pointer-events-auto absolute left-0 top-0 origin-left will-change-transform"
            style={{ opacity: 0 }}
          >
            <button
              type="button"
              onPointerEnter={() => hover(i)}
              onFocus={() => hover(i)}
              onBlur={() => hover(null)}
              className="whitespace-nowrap rounded-full border border-line bg-bg/70 px-3 py-1 text-fg transition-[color,border-color,background-color,box-shadow] duration-(--dur-hover) ease-(--ease-out)"
              style={{
                fontSize: s.weight === 3 ? "var(--text-base)" : s.weight === 2 ? "var(--text-sm)" : "var(--text-xs)",
                ...(hovered === i ? hueStyle(groupHue[s.group]) : null),
              }}
            >
              {s.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
