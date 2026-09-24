"use client";

import { motion, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { type RefObject } from "react";
import { SECTION_SPRING } from "@/config/motion";
import { useActiveSection } from "@/hooks/useActiveSection";

type Item = { slug: string; title: string; date: string };

type Props = {
  projectTitle: string;
  projectSlug: string;
  entries: Item[];
  /** The scrolling article column — the rail fills as it's read. */
  articleRef: RefObject<HTMLElement | null>;
};

export function LogSidebar({ projectTitle, entries, articleRef }: Props) {
  const { scrollYProgress } = useScroll({ target: articleRef, offset: ["start 0.2", "end 0.8"] });
  const read = useSpring(scrollYProgress, SECTION_SPRING);
  const scaleY = useTransform(read, [0, 1], [0, 1]);
  const pct = useTransform(read, (v) => `${Math.round(v * 100)}%`);
  const active = useActiveSection(entries.map((e) => e.slug));

  return (
    <aside className="lg:sticky lg:top-28 lg:self-start" aria-label="Log navigation">
      <p className="eyebrow">Build log</p>
      <h1 className="mt-2 text-2xl">{projectTitle}</h1>
      <p className="mt-2 text-sm text-fg-muted">
        {entries.length} {entries.length === 1 ? "entry" : "entries"} · newest first
      </p>

      <div className="mt-8 flex gap-4">
        {/* progress rail */}
        <div aria-hidden className="relative w-px self-stretch bg-line">
          <motion.div className="absolute inset-x-0 top-0 origin-top bg-accent" style={{ scaleY, height: "100%" }} />
        </div>
        <ol className="space-y-3">
          {entries.map((e) => (
            <li key={e.slug}>
              <Link
                href={`#${e.slug}`}
                aria-current={active === e.slug ? "true" : undefined}
                className={["group/item hue-group block text-sm", active === e.slug ? "text-fg" : "text-fg-muted"].join(" ")}
              >
                <span className="font-mono text-xs text-fg-subtle transition-colors duration-(--dur-hover) group-hover/item:text-hue-amber">{e.date}</span>
                <br />
                <span className="hue-text hue-in">{e.title}</span>
              </Link>
            </li>
          ))}
        </ol>
      </div>

      <p className="mt-6 text-xs text-fg-subtle">
        <motion.span>{pct}</motion.span> read
      </p>
      <Link href="/#breakpoints" className="hue-text hue-line mt-8 inline-block text-sm text-fg-muted">
        ← Back to breakpoints
      </Link>
    </aside>
  );
}
