"use client";

/**
 * Scroll choreography — four frames fly in from the corners, stack at the
 * centre, then the hero frame expands to fill the viewport. Adapted from a
 * 21st.dev scaffold: rewritten on `motion/react`, tokens instead of the
 * default look, captions, links, and a static grid under reduced motion.
 */

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";
import { CHOREO } from "@/config/motion";
import { useMounted } from "@/hooks/useMounted";
import { cn } from "@/lib/utils";

export type ChoreoFrame = {
  src: string;
  alt: string;
  caption?: string;
  href?: string;
};

interface ScrollChoreographyProps {
  className?: string;
  /** Exactly four: [topLeft, topRight (hero), bottomLeft, bottomRight]. */
  frames: [ChoreoFrame, ChoreoFrame, ChoreoFrame, ChoreoFrame];
  /** Copy shown while the frames are still apart. */
  title?: string;
  kicker?: string;
}

const X_L = "-22vw";
const X_R = "22vw";
const Y_T = "-16vh";
const Y_B = "16vh";
const KEYS = [0, 0.3, 0.35, 0.65, 1];


export function ScrollChoreography({ className, frames, title, kicker }: ScrollChoreographyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const mounted = useMounted();
  // Only branch to the static grid after hydration; the server always renders the choreography.
  const reduced = (useReducedMotion() ?? false) && mounted;

  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, CHOREO.spring);

  // Phase 1 (0–0.3): diagonal swap. Phase 2 (0.35–0.65): stack. Phase 3 (0.7–0.9): hero expands.
  const tlX = useTransform(p, KEYS, [X_L, X_L, X_L, "0vw", "0vw"]);
  const tlY = useTransform(p, KEYS, [Y_T, Y_B, Y_B, "0vh", "0vh"]);
  const brX = useTransform(p, KEYS, [X_R, X_R, X_R, "0vw", "0vw"]);
  const brY = useTransform(p, KEYS, [Y_B, Y_T, Y_T, "0vh", "0vh"]);
  const blX = useTransform(p, KEYS, [X_L, X_L, X_L, "0vw", "0vw"]);
  const blY = useTransform(p, KEYS, [Y_B, Y_B, Y_B, "0vh", "0vh"]);
  const trX = useTransform(p, KEYS, [X_R, X_R, X_R, "0vw", "0vw"]);
  const trY = useTransform(p, KEYS, [Y_T, Y_T, Y_T, "0vh", "0vh"]);

  const heroW = useTransform(p, [0.65, 0.7, 0.9, 1], ["38vw", "38vw", "100vw", "100vw"]);
  const heroH = useTransform(p, [0.65, 0.7, 0.9, 1], ["26vh", "26vh", "100vh", "100vh"]);
  const heroRadius = useTransform(p, [0.7, 0.9], ["var(--radius-md)", "0px"]);
  const underOpacity = useTransform(p, [0.75, 0.85], [1, 0]);
  const copyOpacity = useTransform(p, [0, 0.25, 0.35], [1, 1, 0]);
  const heroCaptionOpacity = useTransform(p, [0.88, 1], [0, 1]);

  const [tl, tr, bl, br] = frames;

  if (reduced) {
    return (
      <div className={cn("grid grid-cols-2 gap-4", className)}>
        {frames.map((f, i) => (
          <Frame key={`${f.src}-${i}`} frame={f} className="relative aspect-[3/2] w-full" />
        ))}
      </div>
    );
  }

  const base =
    "absolute left-1/2 top-1/2 h-[26vh] w-[38vw] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-md bg-bg-elev will-change-transform";

  return (
    <div ref={containerRef} className={cn("relative w-full", className)} style={{ height: `${CHOREO.heightVh}vh` }}>
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {(title || kicker) && (
          <motion.div className="absolute inset-x-0 top-1/2 z-0 -translate-y-1/2 px-(--gutter) text-center" style={{ opacity: copyOpacity }}>
            {kicker && <p className="eyebrow mb-3">{kicker}</p>}
            {title && <p className="text-2xl leading-tight">{title}</p>}
          </motion.div>
        )}

        <motion.div style={{ x: tlX, y: tlY, opacity: underOpacity }} className={cn(base, "z-10")}>
          <Frame frame={tl} />
        </motion.div>
        <motion.div style={{ x: brX, y: brY, opacity: underOpacity }} className={cn(base, "z-20")}>
          <Frame frame={br} />
        </motion.div>
        <motion.div style={{ x: blX, y: blY, opacity: underOpacity }} className={cn(base, "z-30")}>
          <Frame frame={bl} />
        </motion.div>
        <motion.div
          style={{ x: trX, y: trY, width: heroW, height: heroH, borderRadius: heroRadius }}
          className={cn(base, "z-40")}
        >
          <Frame frame={tr} captionStyle={{ opacity: heroCaptionOpacity }} big />
        </motion.div>
      </div>
    </div>
  );
}

function Frame({
  frame,
  className,
  captionStyle,
  big,
}: {
  frame: ChoreoFrame;
  className?: string;
  captionStyle?: React.ComponentProps<typeof motion.div>["style"];
  big?: boolean;
}) {
  const inner = (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element -- covers are remote placeholders; swap for next/image once they are local */}
      <img
        src={frame.src}
        alt={frame.alt}
        loading="lazy"
        decoding="async"
        className="h-full w-full object-cover grayscale contrast-[1.06] brightness-90 transition-[filter,transform] duration-(--dur-slow) ease-(--ease-out) group-hover/frame:scale-[1.04] group-hover/frame:grayscale-0 group-hover/frame:brightness-100"
      />
      {frame.caption && (
        <motion.div
          className={cn(
            "pointer-events-none absolute inset-x-0 bottom-0 bg-linear-to-t from-bg/85 to-transparent p-4 text-left",
            big && "p-8",
          )}
          style={captionStyle}
        >
          <p className={cn("text-sm text-fg", big && "text-xl")}>
            <span className="hue-text hue-in">{frame.caption}</span>
          </p>
        </motion.div>
      )}
    </>
  );
  return frame.href ? (
    <a href={frame.href} className={cn("group/frame hue-group block h-full w-full", className)} tabIndex={-1} aria-label={frame.caption ?? frame.alt}>
      {inner}
    </a>
  ) : (
    <div className={cn("h-full w-full", className)}>{inner}</div>
  );
}

export default ScrollChoreography;
