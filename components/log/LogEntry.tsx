"use client";

import { motion } from "motion/react";
import { useRef, type ReactNode } from "react";
import { LOG_ENTRY } from "@/config/motion";
import { useCurvePath } from "@/hooks/useCurvePath";

type Props = {
  id: string;
  date: string;
  title: string;
  tags: string[];
  children: ReactNode; // server-rendered MDX
};

/** One log entry: fades + slides in on a gentle curve (bend 0.25 — it's reading content). */
export function LogEntry({ id, date, title, tags, children }: Props) {
  const ref = useRef<HTMLElement>(null);
  const curve = useCurvePath(ref, {
    bend: LOG_ENTRY.bend,
    travel: { x: 3, y: 6 },
    rotate: [0, 0],
    scale: [0.99, 1],
    z: [0, 0],
    offset: ["start end", "start 0.6"],
  });
  const d = new Date(date + "T00:00:00");

  return (
    <motion.article ref={ref} id={id} style={curve} className="scroll-mt-28 border-t border-line py-10 first:border-t-0 first:pt-0">
      <header>
        <p className="eyebrow">
          <time dateTime={date}>{d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</time>
        </p>
        <h2 className="mt-2 text-2xl">{title}</h2>
        <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Tags">
          {tags.map((t) => (
            <li key={t} className="chip rounded-full border border-line px-2 py-0.5 text-xs text-fg-muted">
              {t}
            </li>
          ))}
        </ul>
      </header>
      <div className="prose-log mt-6">{children}</div>
    </motion.article>
  );
}
