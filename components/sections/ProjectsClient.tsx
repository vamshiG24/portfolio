"use client";

import {
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type FocusEvent, type PointerEvent as ReactPointerEvent } from "react";
import { CURVE_PERSPECTIVE_PX, PROJECT_CARD, PROJECT_RAIL } from "@/config/motion";
import { useMounted } from "@/hooks/useMounted";
import type { ProjectFrontmatter } from "@/lib/content";
import { clamp } from "@/lib/rig";
import { cn } from "@/lib/utils";
import { ScrollChoreography, type ChoreoFrame } from "@/components/ui/scroll-choreography";
import { Section } from "./Section";

export type ProjectCardData = ProjectFrontmatter & { excerpt: string };

const FALLBACK_COVER = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80"; // TODO

const pad = (n: number) => String(n).padStart(2, "0");

export function ProjectsClient({ projects }: { projects: ProjectCardData[] }) {
  const featured = projects.filter((p) => p.featured).concat(projects.filter((p) => !p.featured));
  // Four frames for the choreography; pad with the first ones if there are fewer projects.
  const pick = (i: number) => featured[i % Math.max(1, featured.length)];
  const frame = (p: ProjectCardData | undefined, i: number): ChoreoFrame => ({
    src: p?.cover ?? FALLBACK_COVER,
    alt: p ? `${p.title} cover` : `Frame ${i + 1}`,
    caption: p?.title,
    href: p ? `/projects/${p.slug}/log` : undefined,
  });
  const frames: [ChoreoFrame, ChoreoFrame, ChoreoFrame, ChoreoFrame] = [
    frame(pick(1), 1),
    frame(pick(0), 0), // hero = the first featured project
    frame(pick(2), 2),
    frame(pick(3), 3),
  ];

  return (
    <div id="projects" className="scroll-mt-24">
      <div className="relative z-10">
        <ScrollChoreography frames={frames} kicker="04 — Projects" title="Selected work, up close" />
      </div>
      <ProjectRail projects={projects} />
    </div>
  );
}

/**
 * The project cards, pinned and run sideways: scrolling down carries them
 * right → left across the stage. Each card swings, sinks and dims by its
 * distance from the centre, the rail leans into fast scrolls, and a stroked
 * title drifts behind at a slower rate. Reduced motion gets the plain grid.
 */
function ProjectRail({ projects }: { projects: ProjectCardData[] }) {
  const containerRef = useRef<HTMLElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const mounted = useMounted();
  // Only branch to the static grid after hydration; the server always renders the rail.
  const reduced = (useReducedMotion() ?? false) && mounted;
  // Covers off to the side sit outside the clipped stage, where lazy loading would hold them back.
  const near = useInView(containerRef, { once: true, margin: "100% 0px" });

  // How far the track travels (px) and the stage width; `travel` also sizes the scroll runway.
  const distance = useMotionValue(0);
  const stageW = useMotionValue(0);
  const [travel, setTravel] = useState<number | null>(null);

  useEffect(() => {
    const stage = stageRef.current;
    const track = trackRef.current;
    if (!stage || !track) return;
    const measure = () => {
      const d = Math.max(0, track.offsetWidth - stage.clientWidth);
      distance.set(d);
      stageW.set(stage.clientWidth);
      setTravel(d);
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(stage);
    ro.observe(track);
    return () => ro.disconnect();
  }, [reduced, distance, stageW]);

  // p: 0 → 1 while pinned. rise: 0 → 1 while the section comes up into view.
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start start", "end end"] });
  const { scrollYProgress: riseRaw } = useScroll({ target: containerRef, offset: ["start end", "start start"] });
  const p = useSpring(scrollYProgress, PROJECT_RAIL.spring);
  const rise = useSpring(riseRaw, PROJECT_RAIL.spring);
  const x = useTransform(
    [p, rise, distance, stageW],
    ([p, r, d, w]: number[]) => -clamp(p, 0, 1) * d + (1 - clamp(r, 0, 1)) * w * PROJECT_RAIL.enter,
  );

  const skewX = useSpring(
    useTransform(useVelocity(x), (v) =>
      clamp((v / 1000) * PROJECT_RAIL.skewPerKpx, -PROJECT_RAIL.maxSkewDeg, PROJECT_RAIL.maxSkewDeg),
    ),
    PROJECT_RAIL.skewSpring,
  );
  const backdropX = useTransform(x, (v) => v * PROJECT_RAIL.backdropRate);
  const bar = useTransform(p, (v) => clamp(v, 0, 1));
  const count = projects.length;
  const active = useTransform(bar, (v) => pad(Math.round(v * (count - 1)) + 1));
  const hint = useTransform(bar, (v) => 1 - clamp(v / 0.06, 0, 1));

  // Tabbing onto a card off to the side: scroll the page to where that card sits centred.
  const onFocus = (e: FocusEvent<HTMLUListElement>) => {
    const card = (e.target as HTMLElement).closest<HTMLElement>("[data-rail-card]");
    const container = containerRef.current;
    const d = distance.get();
    if (!card || !container || !d) return;
    const t = clamp((card.offsetLeft + card.offsetWidth / 2 - stageW.get() / 2) / d, 0, 1);
    const top = container.getBoundingClientRect().top + window.scrollY + t * (container.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "instant" });
  };

  if (reduced) {
    return (
      <Section id="projects-grid" eyebrow="04 — Projects" title="Selected work">
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-16" style={{ perspective: CURVE_PERSPECTIVE_PX }}>
          {projects.map((p) => (
            <ProjectCard key={p.slug} project={p} />
          ))}
        </div>
      </Section>
    );
  }

  return (
    <section
      ref={containerRef}
      id="projects-grid"
      aria-labelledby="projects-grid-title"
      className="relative z-10"
      // Until measured, a runway of roughly the right length.
      style={{ height: travel === null ? `${100 + count * 60}vh` : `calc(100vh + ${Math.round(travel * PROJECT_RAIL.pace)}px)` }}
    >
      <div ref={stageRef} className="rail-stage sticky top-0 flex h-screen w-full flex-col overflow-clip">
        <motion.p aria-hidden className="rail-backdrop" style={{ x: backdropX }}>
          Selected work — Selected work — Selected work —
        </motion.p>

        <div className="container-page relative pt-[max(5.5rem,calc(104*var(--u)+1.5rem))]">
          <div className="rule flex items-end justify-between gap-6 pt-6">
            <div className="flex-1 md:grid md:grid-cols-[14rem_1fr] md:gap-12">
              <p className="eyebrow mb-3 md:mb-0">04 — Projects</p>
              <h2 id="projects-grid-title" className="text-3xl">
                Selected work
              </h2>
            </div>
            <p className="eyebrow shrink-0 tabular-nums" aria-hidden>
              <motion.span className="text-fg">{active}</motion.span> / {pad(count)}
            </p>
          </div>
        </div>

        <div className="relative min-h-0 flex-1 py-6 md:py-8" style={{ perspective: PROJECT_RAIL.perspectivePx }}>
          <motion.ul
            ref={trackRef}
            aria-label="Projects"
            onFocus={onFocus}
            style={{ x, skewX, transformStyle: "preserve-3d" }}
            className="relative flex h-full w-max items-center gap-(--rail-gap) px-[calc(50%-var(--card-w)/2)] will-change-transform"
          >
            {projects.map((p) => (
              <RailCard key={p.slug} project={p} x={x} stageW={stageW} eager={near} />
            ))}
          </motion.ul>
        </div>

        <div className="container-page relative pb-6 md:pb-8">
          <div className="relative h-px bg-line">
            <motion.div className="absolute inset-0 origin-left bg-fg/70" style={{ scaleX: bar }} />
          </div>
          <motion.p className="eyebrow mt-3" style={{ opacity: hint }} aria-hidden>
            Keep scrolling — the work slides by →
          </motion.p>
        </div>
      </div>
    </section>
  );
}

function RailCard({
  project,
  x,
  stageW,
  eager,
}: {
  project: ProjectCardData;
  x: MotionValue<number>;
  stageW: MotionValue<number>;
  eager: boolean;
}) {
  const ref = useRef<HTMLLIElement>(null);
  // Centre within the track; offsetLeft ignores transforms, so this only changes on resize.
  const center = useMotionValue(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => center.set(el.offsetLeft + el.offsetWidth / 2);
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    if (el.parentElement) ro.observe(el.parentElement);
    return () => ro.disconnect();
  }, [center]);

  // n: this card's distance from the stage centre, in half-stage widths.
  const n = useTransform([x, center, stageW], ([x, c, w]: number[]) =>
    w ? clamp((c + x - w / 2) / (w / 2), -PROJECT_RAIL.maxN, PROJECT_RAIL.maxN) : 0,
  );
  const rotateY = useTransform(n, (v) => v * PROJECT_RAIL.swingDeg);
  const z = useTransform(n, (v) => -Math.abs(v) * PROJECT_RAIL.depthPx);
  const y = useTransform(n, (v) => v * v * PROJECT_RAIL.dipPx);
  const dim = useTransform(n, (v) => 1 - Math.min(1, Math.abs(v)) * PROJECT_RAIL.dim);

  return (
    <motion.li
      ref={ref}
      data-rail-card
      style={{ rotateY, z, y, transformStyle: "preserve-3d" }}
      className="h-full max-h-[calc(var(--card-w)*0.625+19rem)] w-(--card-w) shrink-0 will-change-transform"
    >
      <ProjectCard project={project} rail={{ drift: n, dim, eager }} />
    </motion.li>
  );
}

function useCoarsePointer() {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(pointer: coarse)");
    const on = () => setCoarse(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return coarse;
}

type RailPose = {
  /** The card's n on the rail: drives the cover's drift inside its frame. */
  drift: MotionValue<number>;
  /** 1 centred → fades toward the edges. */
  dim: MotionValue<number>;
  eager: boolean;
};

/** One project. On the rail it fills its slot (the cover takes the slack); in the grid the cover is 16:10. */
function ProjectCard({ project, rail }: { project: ProjectCardData; rail?: RailPose }) {
  const coarse = useCoarsePointer();

  // Pointer tilt (springs) — disabled on coarse pointers.
  const rx = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const ry = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const lift = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const px = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const py = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);

  // Cover parallax inside the frame: rail drift + pointer offset.
  const still = useMotionValue(0);
  const full = useMotionValue(1);
  const drift = rail?.drift ?? still;
  const dim = rail?.dim ?? full;
  const coverX = useTransform([drift, px], ([d, p]: number[]) => -clamp(d, -1, 1) * PROJECT_CARD.coverParallaxPx + p * 10);
  const coverY = useTransform(py, (v) => v * 10);
  const textOpacity = useTransform(dim, (v) => 0.2 + 0.8 * v);

  const onMove = (e: ReactPointerEvent<HTMLElement>) => {
    if (coarse) return;
    const r = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - r.left) / r.width) * 2 - 1;
    const ny = ((e.clientY - r.top) / r.height) * 2 - 1;
    ry.set(nx * PROJECT_CARD.tiltDeg);
    rx.set(-ny * PROJECT_CARD.tiltDeg);
    px.set(nx);
    py.set(ny);
  };
  const onEnter = () => {
    if (coarse) return;
    lift.set(PROJECT_CARD.hoverLift);
  };
  const onLeave = () => {
    rx.set(0);
    ry.set(0);
    px.set(0);
    py.set(0);
    lift.set(0);
  };

  return (
    <article className="h-full">
      <motion.div
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, y: lift, transformStyle: "preserve-3d" }}
        className="group hue-group relative flex h-full flex-col focus-within:outline-none"
      >
        <div
          className={cn(
            "relative overflow-hidden rounded-md bg-bg-elev transition-shadow duration-(--dur-slow) ease-(--ease-out) group-hover:shadow-[0_34px_70px_-34px_rgba(155,123,255,0.6),0_18px_40px_-24px_rgba(255,93,143,0.5)]",
            rail ? "min-h-28 flex-1" : "aspect-[16/10]",
          )}
        >
          <motion.img
            src={project.cover ?? FALLBACK_COVER}
            alt={`${project.title} — cover`}
            loading={rail?.eager ? "eager" : "lazy"}
            decoding="async"
            className="absolute inset-0 h-[115%] w-[115%] max-w-none -translate-x-[7%] -translate-y-[7%] object-cover grayscale contrast-[1.06] brightness-90 transition-[filter] duration-(--dur-slow) ease-(--ease-out) group-hover:grayscale-0 group-hover:brightness-100"
            style={{ x: coverX, y: coverY, opacity: dim }}
          />
          {project.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium uppercase tracking-(--tracking-wide) text-accent-fg">
              Featured
            </span>
          )}
        </div>

        <motion.div
          className={cn("rule rule-glow mt-5 flex flex-col pt-5", rail ? "shrink-0" : "flex-1")}
          style={rail ? { opacity: textOpacity } : undefined}
        >
          <p className="eyebrow">
            {project.period} · {project.role}
          </p>
          <h3 className="mt-2 text-xl">
            <Link
              href={`/projects/${project.slug}/log`}
              className="hue-text hue-in after:absolute after:inset-0 focus-visible:outline-none"
            >
              {project.title}
            </Link>
          </h3>
          <p className={cn("mt-2 text-fg-muted", rail && "line-clamp-2 [@media(max-height:44rem)]:hidden")}>{project.blurb}</p>
          {/* On the rail the stack keeps to one row; the full list is in the build log. */}
          <ul className={cn("mt-4 flex flex-wrap gap-1.5", rail && "max-h-[1.625rem] overflow-hidden")} aria-label="Stack">
            {project.stack.map((s) => (
              <li key={s} className="chip rounded-full border border-line px-2.5 py-0.5 text-xs text-fg-subtle">
                {s}
              </li>
            ))}
          </ul>
          <div className="relative z-10 mt-auto flex items-center gap-5 pt-6 text-sm">
            <span className="ghost hue-in text-sm">Build log →</span>
            {project.demo && (
              <a href={project.demo} target="_blank" rel="noreferrer noopener" className="hue-text hue-line text-fg-muted">
                Live
              </a>
            )}
            {project.repo && (
              <a href={project.repo} target="_blank" rel="noreferrer noopener" className="hue-text hue-line text-fg-muted">
                Code
              </a>
            )}
          </div>
        </motion.div>
      </motion.div>
    </article>
  );
}
