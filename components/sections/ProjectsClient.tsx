"use client";

import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from "react";
import { CURVE_PERSPECTIVE_PX, PROJECT_CARD, SECTION_SPRING } from "@/config/motion";
import { useCurvePath } from "@/hooks/useCurvePath";
import type { ProjectFrontmatter } from "@/lib/content";
import { ScrollChoreography, type ChoreoFrame } from "@/components/ui/scroll-choreography";
import { Section } from "./Section";

export type ProjectCardData = ProjectFrontmatter & { excerpt: string };

const FALLBACK_COVER = "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1600&q=80"; // TODO

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
      <Section id="projects-grid" eyebrow="04 — Projects" title="Selected work">
        <div className="grid gap-10 md:grid-cols-2 md:gap-x-12 md:gap-y-16" style={{ perspective: CURVE_PERSPECTIVE_PX }}>
          {projects.map((p, i) => (
            <ProjectCard key={p.slug} project={p} index={i} />
          ))}
        </div>
      </Section>
    </div>
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

function ProjectCard({ project, index }: { project: ProjectCardData; index: number }) {
  const ref = useRef<HTMLElement>(null);
  const coarse = useCoarsePointer();

  // Stronger bend than the rest of the site; alternate the side it arrives from.
  const curve = useCurvePath(ref, {
    bend: PROJECT_CARD.bend,
    direction: index % 2 === 0 ? "br-tl" : "bl-tr",
    travel: { x: 18, y: 16 },
    rotate: index % 2 === 0 ? [-8, 0] : [8, 0],
  });

  // Pointer tilt (springs) — disabled on coarse pointers.
  const rx = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const ry = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const lift = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const px = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);
  const py = useSpring(useMotionValue(0), PROJECT_CARD.tiltSpring);

  // Cover parallax inside the frame: scroll-linked + pointer offset.
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  // Function form: range-form transforms of raw scroll values may be "accelerated" onto a native timeline and mis-map here.
  const scrollPar = useSpring(
    useTransform(scrollYProgress, (p) => PROJECT_CARD.coverParallaxPx * (1 - 2 * p)),
    SECTION_SPRING,
  );
  const coverY = useTransform([scrollPar, py], ([s, p]) => (s as number) + (p as number) * 10);
  const coverX = useTransform(px, (v) => v * 10);

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
    <motion.article ref={ref} style={curve.style} className="will-change-transform">
      <motion.div
        onPointerMove={onMove}
        onPointerEnter={onEnter}
        onPointerLeave={onLeave}
        style={{ rotateX: rx, rotateY: ry, y: lift, transformStyle: "preserve-3d" }}
        className="group hue-group relative flex h-full flex-col focus-within:outline-none"
      >
        <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-bg-elev transition-shadow duration-(--dur-slow) ease-(--ease-out) group-hover:shadow-[0_34px_70px_-34px_rgba(155,123,255,0.6),0_18px_40px_-24px_rgba(255,93,143,0.5)]">
          <motion.img
            src={project.cover ?? FALLBACK_COVER}
            alt={`${project.title} — cover`}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-[115%] w-[115%] -translate-x-[7%] -translate-y-[7%] object-cover grayscale contrast-[1.06] brightness-90 transition-[filter] duration-(--dur-slow) ease-(--ease-out) group-hover:grayscale-0 group-hover:brightness-100"
            style={{ x: coverX, y: coverY }}
          />
          {project.featured && (
            <span className="absolute left-4 top-4 rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium uppercase tracking-(--tracking-wide) text-accent-fg">
              Featured
            </span>
          )}
        </div>

        <div className="rule rule-glow mt-5 flex flex-1 flex-col pt-5">
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
          <p className="mt-2 text-fg-muted">{project.blurb}</p>
          <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Stack">
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
        </div>
      </motion.div>
    </motion.article>
  );
}
