"use client";

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import { useEffect, useRef, type ComponentProps } from "react";
import { MAGNET } from "@/config/motion";
import { cn } from "@/lib/utils";

type Props = ComponentProps<typeof motion.a> & { href: string };

/**
 * Magnetic CTA: within MAGNET.radius px the button translates toward the
 * cursor (MAGNET.strength of the offset) and springs back on leave. Fine
 * pointers only; touch and reduced-motion get a plain button.
 */
export function MagneticButton({ className, children, ...rest }: Props) {
  const ref = useRef<HTMLAnchorElement>(null);
  const reduced = useReducedMotion() ?? false;
  const x = useSpring(useMotionValue(0), MAGNET.spring);
  const y = useSpring(useMotionValue(0), MAGNET.spring);

  useEffect(() => {
    if (reduced || !window.matchMedia("(pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    // Only track the pointer while the button is anywhere near the viewport: measuring it on
    // every move from the far end of the page is wasted work.
    let near = false;
    const io = new IntersectionObserver(([entry]) => {
      near = entry.isIntersecting;
      if (!near) {
        x.set(0);
        y.set(0);
      }
    }, { rootMargin: `${MAGNET.radius}px` });
    io.observe(el);
    const onMove = (e: PointerEvent) => {
      if (!near) return;
      const r = el.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d < MAGNET.radius) {
        const k = (1 - d / MAGNET.radius) * MAGNET.strength;
        x.set(dx * k);
        y.set(dy * k);
      } else {
        x.set(0);
        y.set(0);
      }
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      io.disconnect();
      window.removeEventListener("pointermove", onMove);
    };
  }, [reduced, x, y]);

  return (
    <motion.a
      ref={ref}
      style={{ x, y }}
      className={cn(
        "sweep group/magnet inline-flex items-center gap-2 rounded-full bg-accent px-7 py-3.5 text-base font-medium text-accent-fg",
        className,
      )}
      {...rest}
    >
      {children}
    </motion.a>
  );
}
