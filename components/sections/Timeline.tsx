"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { CURVE_PERSPECTIVE_PX, SECTION_SPRING, TIMELINE } from "@/config/motion";
import { timeline, type TimelineEntry as Entry } from "@/content/timeline";
import { useCurvePath } from "@/hooks/useCurvePath";
import { Section } from "./Section";

export function Timeline() {
  const ref = useRef<HTMLDivElement>(null);
  // Spine draws from when the section top hits 75% of the viewport until its bottom reaches 40%
  // (sprung, except under reduced motion).
  const reduced = useReducedMotion() ?? false;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.75", "end 0.4"] });
  const sprung = useSpring(scrollYProgress, SECTION_SPRING);
  const pathLength = reduced ? scrollYProgress : sprung;

  return (
    <Section id="timeline" eyebrow="02 — Timeline" title="Where I've been">
      <div ref={ref} className="relative" style={{ perspective: CURVE_PERSPECTIVE_PX }}>
        {/* the spine */}
        <svg
          aria-hidden
          className="pointer-events-none absolute left-4 top-0 h-full w-2 md:left-1/2 md:-translate-x-1/2"
          viewBox="0 0 8 100"
          preserveAspectRatio="none"
          fill="none"
        >
          <path d="M4 0V100" stroke="var(--line-strong)" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          <motion.path
            d="M4 0V100"
            stroke="var(--accent)"
            strokeWidth="2"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            style={{ pathLength }}
          />
        </svg>

        <ol className="space-y-16 md:space-y-24">
          {timeline.map((entry, i) => (
            <TimelineEntry key={entry.id} entry={entry} index={i} />
          ))}
        </ol>
      </div>
    </Section>
  );
}

/** Node glyph per entry kind — inline SVG so it scales and themes like everything else. */
function Glyph({ kind }: { kind: Entry["kind"] }) {
  const common = { width: 10, height: 10, viewBox: "0 0 10 10", fill: "currentColor", "aria-hidden": true } as const;
  if (kind === "work") return <svg {...common}><path d="M5 0l5 5-5 5-5-5z" /></svg>;
  if (kind === "education") return <svg {...common}><circle cx="5" cy="5" r="4" /></svg>;
  return <svg {...common}><path d="M5 0l1.5 3.4 3.5.4-2.6 2.4.7 3.6L5 8.1 1.9 9.8l.7-3.6L0 3.8l3.5-.4z" /></svg>;
}

function TimelineEntry({ entry, index }: { entry: Entry; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const right = index % 2 === 1;
  const near = index % 2 === 0;

  // Enter on the curve from the entry's own side; nearer entries sit closer to the camera.
  const curve = useCurvePath(ref, {
    bend: TIMELINE.bend,
    direction: right ? "br-tl" : "bl-tr",
    travel: { x: 16, y: 12 },
    z: [near ? TIMELINE.zFar : TIMELINE.zFar * 0.5, near ? TIMELINE.zNear : 0],
    rotate: right ? [-6, 0] : [6, 0],
  });

  // Nearer entries parallax faster as they pass through the viewport.
  const { scrollYProgress: pass } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const passSprung = useSpring(pass, SECTION_SPRING);
  const parallax = useTransform(passSprung, [0, 1], near ? [36, -36] : [12, -12]);

  // Active node: peaks when the node crosses the viewport centre band.
  const { scrollYProgress: cross } = useScroll({ target: nodeRef, offset: ["center 0.7", "center 0.3"] });
  const crossSprung = useSpring(cross, SECTION_SPRING);
  const active = useTransform(crossSprung, (p) => 1 - Math.min(1, Math.abs(p * 2 - 1)));
  const nodeScale = useTransform(active, [0, 1], [1, TIMELINE.activeScale]);
  const nodeGlow = useTransform(active, (a) => `0 0 ${(a * 28).toFixed(1)}px ${(a * 6).toFixed(1)}px color-mix(in srgb, var(--accent) ${(a * 70).toFixed(0)}%, transparent)`);
  const nodeBg = useTransform(active, (a) => `color-mix(in srgb, var(--accent) ${(a * 100).toFixed(0)}%, var(--bg-elev-2))`);
  const nodeColor = useTransform(active, (a) => (a > 0.5 ? "var(--accent-fg)" : "var(--fg-muted)"));

  return (
    <motion.li
      ref={ref}
      className={[
        "relative pl-12 md:grid md:grid-cols-2 md:gap-16 md:pl-0",
        right ? "md:[&>article]:col-start-2" : "",
      ].join(" ")}
      style={curve}
    >
      {/* node on the spine */}
      <motion.span
        ref={nodeRef}
        aria-hidden
        className="absolute left-4 top-1.5 z-10 flex h-7 w-7 -translate-x-1/2 items-center justify-center rounded-full border border-line-strong bg-bg text-[10px] md:left-1/2"
        style={{ scale: nodeScale, boxShadow: nodeGlow, backgroundColor: nodeBg, color: nodeColor }}
      >
        <Glyph kind={entry.kind} />
      </motion.span>

      <motion.article
        className={[
          "group/entry hue-group rule rule-glow pt-6",
          right ? "md:text-left" : "md:text-right",
        ].join(" ")}
        // right-aligned copy: its rule lights from the spine side
        data-glow-from={right ? undefined : "end"}
        style={{ y: parallax }}
      >
        <p className="eyebrow">
          <time>{entry.period}</time> · {entry.kind}
        </p>
        <h3 className="mt-3 text-xl"><span className="hue-text hue-in">{entry.title}</span></h3>
        <p className="mt-1 text-sm text-fg-muted">{entry.org}</p>
        <p className="mt-4 text-base text-fg-muted">{entry.summary}</p>
        {entry.highlights && (
          <ul className={["mt-4 space-y-1 text-sm text-fg-muted", right ? "" : "md:ml-auto"].join(" ")}>
            {entry.highlights.map((h) => (
              <li key={h} className="before:mr-2 before:text-accent before:transition-colors before:duration-(--dur-hover) before:content-['—'] group-hover/entry:before:text-hue-rose">
                {h}
              </li>
            ))}
          </ul>
        )}
      </motion.article>
    </motion.li>
  );
}
