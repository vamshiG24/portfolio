"use client";

import { motion, useMotionValue, useMotionValueEvent, useReducedMotion, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ParticleText } from "@/components/ui/particle-text";
import { INTRO, SCROLL_CUE } from "@/config/motion";
import { site } from "@/content/site";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useMounted } from "@/hooks/useMounted";
import { bgStore } from "@/lib/bgStore";
import { clamp, smoothstep } from "@/lib/rig";
import { useScrollContext } from "@/providers/ScrollProvider";

const ramp = (p: number, a: number, b: number) => smoothstep(a, b, p);

/* The pinned track is the intro plus the hand-off; both run 0→1 over their own stretch of it. */
const TRACK_VH = INTRO.heightVh + INTRO.handoffVh;
const introOf = (p: number) => clamp((p * (TRACK_VH - 100)) / (INTRO.heightVh - 100), 0, 1);
const handoffOf = (p: number) => clamp((p * (TRACK_VH - 100) - (INTRO.heightVh - 100)) / INTRO.handoffVh, 0, 1);

/**
 * Intro hero (spec-1 composition over the footage): the name in particles,
 * one sub, a CTA pair, the stage behind, a logo strip in the bottom fade. The
 * tall scroll track scrubs the clip — closed door, the leaves swing open, the
 * walk-in — and the panels cross-fade under the name in the dead zones between
 * those beats (INTRO.cues). The name starts centred and slides left as the
 * doors open (INTRO.name). A last pinned stretch (INTRO.handoffVh) carries the
 * figure into the About plate while the name and the final panel fade. The h1
 * is the LCP element and always in the DOM.
 */
export function Home() {
  const track = useRef<HTMLElement>(null);
  const mounted = useMounted();
  const reduced = (useReducedMotion() ?? false) && mounted;
  const { scrollYProgress } = useScroll({ target: track, offset: ["start start", "end end"] });
  const intro = useTransform(scrollYProgress, introOf);
  const handoff = useTransform(scrollYProgress, handoffOf);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    bgStore.heroProgress.set(introOf(v));
    bgStore.handoff.set(handoffOf(v));
  });
  // ...and once on mount, so a client-side return to this page starts from the right frame.
  useEffect(() => {
    const v = scrollYProgress.get();
    bgStore.heroProgress.set(introOf(v));
    bgStore.handoff.set(handoffOf(v));
  }, [scrollYProgress]);

  const sub = splitTwo(site.tagline);

  return (
    <section ref={track} id="home" aria-labelledby="home-title" className="relative z-10" style={{ height: `${TRACK_VH}vh` }}>
      <div className="stage sticky top-0 h-svh w-full overflow-hidden">
        {/* Panel 1 — closed door, centred under the name */}
        <Panel progress={intro} cue={INTRO.cues[0]} reduced={reduced} scrim="soft" align="center">
          <p className="sub">
            <span>{sub[0]}</span>
            <span>{sub[1]}</span>
          </p>
          <div className="actions">
            <a href="#projects" className="pill pill-cta"><span>See selected work</span></a>
            <a href="#about" className="ghost">About me</a>
          </div>
        </Panel>

        {/* Panel 2 — door open, the walk begins */}
        <Panel progress={intro} cue={INTRO.cues[1]} reduced={reduced}>
          <p className="eyebrow mb-5">What I do</p>
          <h2 className="headline headline-sm">
            <span>Secure backends.</span>
            <span>Reliable AI.</span>
          </h2>
          <p className="sub"><span>Interfaces with real craft.</span></p>
        </Panel>

        {/* Panel 3 — inside; leaves as the figure starts moving into About */}
        <Panel progress={intro} cue={INTRO.cues[2]} reduced={reduced} exit={handoff}>
          <p className="eyebrow mb-5">Come in</p>
          <h2 className="headline headline-sm">
            <span>Let&apos;s look</span>
            <span>at the work.</span>
          </h2>
          <div className="actions">
            <a href="#projects" className="pill pill-cta"><span>See selected work</span></a>
            <a href="#about" className="ghost">About me</a>
          </div>
        </Panel>

        <Name progress={intro} exit={handoff} />
        <LogoStrip progress={intro} />
        <Loader />
        <ScrollCue progress={intro} />
      </div>
    </section>
  );
}

/** Split a sentence into two roughly equal lines at a word boundary. */
function splitTwo(text: string): [string, string] {
  const words = text.split(" ");
  let best = 1;
  let bestDiff = Infinity;
  for (let i = 1; i < words.length; i++) {
    const a = words.slice(0, i).join(" ").length;
    const b = words.slice(i).join(" ").length;
    const d = Math.abs(a - b);
    if (d < bestDiff) {
      bestDiff = d;
      best = i;
    }
  }
  return [words.slice(0, best).join(" "), words.slice(best).join(" ")];
}

function Panel({
  progress,
  cue,
  reduced,
  scrim,
  align,
  exit,
  children,
}: {
  progress: MotionValue<number>;
  cue: readonly [number, number, number, number];
  reduced: boolean;
  /** "soft" for a panel that sits on the dark closed door (see .hero-panel::before). */
  scrim?: "soft";
  /** "center" for copy under the still-centred name (see .hero-copy[data-align]). */
  align?: "center";
  /** Optional 0→1 value that fades the panel out over its first 40% (the hand-off). */
  exit?: MotionValue<number>;
  children: React.ReactNode;
}) {
  const [a, b, c, d] = cue;
  const none = useMotionValue(0);
  const opacity = useTransform([progress, exit ?? none], ([p, e]) => ramp(p as number, a, b) * (1 - ramp(p as number, c, d)) * (1 - ramp(e as number, 0, 0.4)));
  const y = useTransform(progress, (p) => (reduced ? 0 : (1 - ramp(p, a, b)) * INTRO.drift - ramp(p, c, d) * INTRO.drift));
  const events = useTransform(opacity, (o) => (o > 0.6 ? "auto" : "none"));
  return (
    <motion.div className="hero-panel" data-scrim={scrim} style={{ opacity, y, pointerEvents: events, willChange: "opacity, transform" }}>
      <div className="hero-copy" data-align={align}>{children}</div>
    </motion.div>
  );
}

/**
 * The name in particles, one row above the panels. The particles gather into
 * it on load; it sits centred over the closed door and slides to the gutter as
 * the leaves swing open — a pure horizontal slide, the row keeps its height
 * throughout — then fades with the hand-off. The h1's own text (transparent)
 * sizes the row and is what assistive tech and crawlers read; the canvas bleeds
 * past it so the particles have room to gather, and pushes away from the cursor.
 */
function Name({ progress, exit }: { progress: MotionValue<number>; exit: MotionValue<number> }) {
  const [a, b] = INTRO.name.slide;
  // .hero-name is a size container spanning gutter to gutter: 50cqw − 50% is the offset that centres the name in it.
  const x = useTransform(progress, (p) => `calc(${(1 - ramp(p, a, b)).toFixed(4)} * (50cqw - 50%))`);
  const opacity = useTransform(exit, (e) => 1 - ramp(e, 0, 0.4));
  // The canvas redraws every frame: keep it mounted only while the name can be seen (it gathers again on the way back).
  const [live, setLive] = useState(true);
  useMotionValueEvent(opacity, "change", (o) => setLive(o > 0));
  const tier = useDeviceTier();
  const pt = INTRO.name.particles;
  return (
    <motion.div className="hero-name" style={{ opacity }}>
      <motion.h1 id="home-title" style={{ x, willChange: "transform" }}>
        <span className="hero-name-text">{site.name}</span>
        {live && tier.ready && (
          <div className="hero-name-canvas" aria-hidden>
            <ParticleText
              text={site.name}
              particleSize={pt.size}
              density={pt.density}
              color="#fafafa" /* --fg */
              highlightColor="#a7a6a6" /* --fg-muted */
              scatter={pt.scatter}
              gatherDuration={pt.gatherMs}
              stagger={pt.stagger}
              pointerRepel={pt.repel}
              repelRadius={pt.repelRadius}
              idleDrift={pt.drift}
              fontSize="var(--name-fs)"
              fontWeight={700}
              // The per-particle shadow blur is the costly part: skip it on phones and low-end machines.
              glow={!tier.mobile && !tier.lowEnd}
            />
          </div>
        )}
      </motion.h1>
    </motion.div>
  );
}

/** Four monochrome marks in the bottom fade; fade out as the door opens. */
function LogoStrip({ progress }: { progress: MotionValue<number> }) {
  const opacity = useTransform(progress, (p) => 1 - ramp(p, 0.02, 0.12));
  return (
    <motion.ul className="logos" aria-label="Built with" style={{ opacity }}>
      {STRIP.map((s) => (
        <li key={s.word} className="lg">
          {s.icon}
          <span className="lg-word">{s.word}</span>
        </li>
      ))}
    </motion.ul>
  );
}

const STRIP = [
  {
    word: "react",
    icon: (
      <svg viewBox="0 0 30 31" aria-hidden><rect x="1.6" y="2.1" width="26.8" height="26.8" rx="2.5" fill="none" stroke="currentColor" strokeWidth="3.1" /><circle cx="19.5" cy="10.5" r="5.1" fill="currentColor" /></svg>
    ),
  },
  {
    word: "node.js",
    icon: (
      <svg viewBox="0 0 25 30" aria-hidden><rect x="0" y="0" width="7.5" height="30" fill="currentColor" /><circle cx="17" cy="15" r="6" fill="none" stroke="currentColor" strokeWidth="3.1" /><path d="M17 9a6 6 0 0 1 0 12Z" fill="currentColor" /></svg>
    ),
  },
  {
    word: "langgraph",
    icon: (
      <svg viewBox="0 0 28 28" aria-hidden><circle cx="14" cy="14" r="12.35" fill="none" stroke="currentColor" strokeWidth="3.1" /><path d="M7 16c3-6 8-6 11-1M9 20c3-4 7-4 10 0" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" /></svg>
    ),
  },
  {
    word: "docker",
    icon: (
      <svg viewBox="0 0 28 25.5" aria-hidden><path d="M2 14c2-8 22-8 24 0v2H2z" fill="currentColor" /><path d="M3 20h22M5 24h18" fill="none" stroke="currentColor" strokeWidth="3.05" strokeLinecap="round" /></svg>
    ),
  },
];

/** Thin preload bar while the character/stage loads; disappears once ready. */
function Loader() {
  const scaleX = bgStore.introLoad;
  const opacity = useTransform(scaleX, [0, 0.99, 1], [1, 1, 0]);
  const label = useTransform(scaleX, (v) => `LOADING ${Math.round(v * 100)}%`);
  return (
    <motion.div className="pointer-events-none absolute bottom-[calc(140*var(--u))] left-1/2 flex -translate-x-1/2 flex-col items-center gap-2" style={{ opacity }} aria-live="polite">
      <div className="h-px w-36 overflow-hidden bg-line">
        <motion.i className="block h-full w-full origin-left bg-fg" style={{ scaleX }} />
      </div>
      <motion.span className="eyebrow text-[11px]">{label}</motion.span>
    </motion.div>
  );
}

/** Scroll-down cue whose bounce follows scroll velocity; gone once the door starts opening. */
function ScrollCue({ progress }: { progress: MotionValue<number> }) {
  const { velocity } = useScrollContext();
  const bounce = useTransform(velocity, (v) => Math.min(SCROLL_CUE.maxBounce, (Math.abs(v) / SCROLL_CUE.velocityScale) * SCROLL_CUE.maxBounce));
  const y = useSpring(bounce, { stiffness: 300, damping: 18, mass: 0.4 });
  // Function form on purpose: the range form of a raw useScroll value gets
  // "accelerated" onto a native ScrollTimeline, which mis-maps for an element
  // inside the sticky child of the tracked section (verified: stays at 1).
  const opacity = useTransform(progress, (p) => 1 - ramp(p, 0, 0.06));
  return (
    <motion.div aria-hidden className="absolute left-1/2 top-[calc(925*var(--u))] -translate-x-1/2 text-fg-subtle portrait-hide" style={{ opacity }}>
      <motion.span className="block animate-cue" style={{ y }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden>
          <path d="M12 4v16m0 0 6-6m-6 6-6-6" />
        </svg>
      </motion.span>
    </motion.div>
  );
}
