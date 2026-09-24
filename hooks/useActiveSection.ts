"use client";

import { useMotionValueEvent } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { useScrollContext } from "@/providers/ScrollProvider";

/**
 * Which section id is currently "active" for the nav: the last section whose
 * top has passed a line 42% down the viewport. Driven by the shared scrollY
 * MotionValue (no per-frame layout reads — offsets are cached on resize).
 */
export function useActiveSection(ids: readonly string[]): string | null {
  const { scrollY } = useScrollContext();
  const [active, setActive] = useState<string | null>(ids[0] ?? null);
  const tops = useRef<{ id: string; top: number }[]>([]);

  useEffect(() => {
    const measure = () => {
      tops.current = ids
        .map((id) => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top + window.scrollY } : null;
        })
        .filter((v): v is { id: string; top: number } => !!v)
        .sort((a, b) => a.top - b.top);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(document.body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [ids]);

  useMotionValueEvent(scrollY, "change", (y) => {
    const line = y + window.innerHeight * 0.42;
    let current: string | null = tops.current[0]?.id ?? null;
    for (const t of tops.current) if (t.top <= line) current = t.id;
    if (current !== active) setActive(current);
  });

  return active;
}
