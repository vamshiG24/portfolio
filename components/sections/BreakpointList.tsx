"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useRef, type PointerEvent as ReactPointerEvent } from "react";
import { CURVE_PERSPECTIVE_PX, LOG_ENTRY } from "@/config/motion";
import { useCurvePath } from "@/hooks/useCurvePath";

export type BreakpointItem = {
  slug: string;
  project: string;
  projectTitle: string;
  date: string;
  title: string;
  tags: string[];
  challenge: string;
  solution: string;
};

export function BreakpointList({ items }: { items: BreakpointItem[] }) {
  return (
    <ol className="mt-12 grid gap-5 md:gap-6" style={{ perspective: CURVE_PERSPECTIVE_PX }}>
      {items.map((item, i) => (
        <Breakpoint key={`${item.project}/${item.slug}`} item={item} index={i} />
      ))}
    </ol>
  );
}

/** Keeps the card's wash of light under the pointer: two custom properties, no React state. */
function trackLight(e: ReactPointerEvent<HTMLElement>) {
  if (e.pointerType !== "mouse") return;
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${Math.round(e.clientX - r.left)}px`);
  el.style.setProperty("--my", `${Math.round(e.clientY - r.top)}px`);
}

/**
 * One breakpoint: the challenge on the left, the solution on the right. The
 * whole card links to the full log entry. At rest it is monochrome; under the
 * pointer the edge takes the spectrum, the challenge side lights rose and the
 * solution side teal (see .bp-card in globals.css).
 */
function Breakpoint({ item, index }: { item: BreakpointItem; index: number }) {
  const ref = useRef<HTMLLIElement>(null);
  const curve = useCurvePath(ref, { bend: LOG_ENTRY.bend, travel: { x: 4, y: 8 }, rotate: [0, 0], scale: [0.98, 1] });
  const date = new Date(item.date + "T00:00:00");

  return (
    <motion.li ref={ref} style={curve.style}>
      <article onPointerMove={trackLight} className="bp-card hue-group">
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span aria-hidden className="hue-text hue-in font-mono text-xs text-fg-subtle">
            {String(index + 1).padStart(2, "0")}
          </span>
          <p className="eyebrow">
            {item.projectTitle} · <time dateTime={item.date}>{date.toLocaleDateString("en-GB", { month: "short", year: "numeric" })}</time>
          </p>
          <ul className="flex flex-wrap gap-1.5 sm:ml-auto" aria-label="Tags">
            {item.tags.map((t) => (
              <li key={t} className="chip rounded-full border border-line px-2 py-0.5 text-xs text-fg-subtle">
                {t}
              </li>
            ))}
          </ul>
        </header>

        <h3 className="mt-4 text-xl">
          <Link
            href={`/projects/${item.project}/log#${item.slug}`}
            className="hue-text hue-in after:absolute after:inset-0 focus-visible:outline-none"
          >
            {item.title}
          </Link>
        </h3>

        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:gap-6">
          <div className="bp-side" data-side="challenge">
            <p className="bp-label">
              <i aria-hidden />
              Challenge
            </p>
            <p className="mt-2 text-fg-muted">{item.challenge}</p>
          </div>
          <span aria-hidden className="bp-arrow hidden md:block">
            →
          </span>
          <div className="bp-side" data-side="solution">
            <p className="bp-label">
              <i aria-hidden />
              Solution
            </p>
            <p className="mt-2 text-fg">{item.solution}</p>
          </div>
        </div>

        <div className="mt-6">
          <span className="ghost hue-in text-sm">Read the full log →</span>
        </div>
      </article>
    </motion.li>
  );
}
