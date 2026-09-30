"use client";

import { motion, useMotionValueEvent, useScroll, useSpring, useTransform, type MotionValue } from "motion/react";
import Link from "next/link";
import { useEffect, useRef, type FocusEvent } from "react";
import { BREAKPOINT_RUN } from "@/config/motion";
import { clamp } from "@/lib/rig";
import type { BreakpointItem } from "../BreakpointList";
import { TextMorph, palette, sampleText } from "./morph";
import { drawPulse, type PulseColors } from "./pulse";
import { STATUS, locate, ramp, stateAt } from "./timeline";

const P = BREAKPOINT_RUN.phase;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Breakpoints, played as failures and recoveries. The section pins; each
 * breakpoint gets a stretch of scroll in which the heartbeat along the bottom
 * fibrillates while its challenge glitches, flatlines while the challenge
 * dissolves and its particles stream through the gate to write the solution,
 * then takes a shock and beats again as the fix lands. Everything is scrubbed
 * by scroll: back up and the fix breaks back into the bug.
 */
export function BreakpointRun({ items }: { items: BreakpointItem[] }) {
  const count = items.length;
  const runwayRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const morphRef = useRef<HTMLCanvasElement>(null);
  const traceRef = useRef<HTMLCanvasElement>(null);
  const headRef = useRef<HTMLSpanElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({ target: runwayRef, offset: ["start start", "end end"] });
  const p = useSpring(scrollYProgress, BREAKPOINT_RUN.spring);
  // Run position: breakpoint k plays while u crosses [k, k + 1].
  const u = useTransform(p, (v) => clamp(v, 0, 1) * count);

  // Both canvases are drawn imperatively from u; nothing here re-renders React.
  useEffect(() => {
    const stage = stageRef.current;
    const morphCanvas = morphRef.current;
    const traceCanvas = traceRef.current;
    const mctx = morphCanvas?.getContext("2d");
    const tctx = traceCanvas?.getContext("2d");
    if (!stage || !morphCanvas || !traceCanvas || !mctx || !tctx) return;

    const css = getComputedStyle(document.documentElement);
    const token = (name: string, fallback: string) => css.getPropertyValue(name).trim() || fallback;
    const rose = token("--hue-rose", "#ff5d8f");
    const teal = token("--hue-teal", "#5eead4");
    const tones = palette([rose, token("--fg", "#fafafa"), teal], 16);
    const traceColors: PulseColors = {
      running: "rgba(250, 250, 250, 0.72)",
      exception: rose,
      flatline: rose,
      patching: rose,
      restart: teal,
      resolved: teal,
      grid: "rgba(255, 255, 255, 0.045)",
    };

    let dpr = 1;
    let mw = 0;
    let mh = 0;
    let tw = 0;
    let th = 0;
    const morphs = new Map<number, TextMorph>();
    let dirty = false;
    let shown = "";

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      ({ width: mw, height: mh } = stage.getBoundingClientRect());
      morphCanvas.width = Math.round(mw * dpr);
      morphCanvas.height = Math.round(mh * dpr);
      ({ width: tw, height: th } = traceCanvas.getBoundingClientRect());
      traceCanvas.width = Math.round(tw * dpr);
      traceCanvas.height = Math.round(th * dpr);
      morphs.clear(); // glyph positions moved: resample on next use
    };

    // Sample breakpoint k's texts. Only called mid-breakpoint, when its slide is at rest.
    const build = (k: number) => {
      const slide = stage.querySelector<HTMLElement>(`[data-bp="${k}"]`);
      const from = slide?.querySelector<HTMLElement>('[data-text="challenge"]');
      const to = slide?.querySelector<HTMLElement>('[data-text="solution"]');
      const gate = slide?.querySelector<HTMLElement>("[data-gate]");
      if (!from || !to || !gate) return undefined;
      const origin = morphCanvas.getBoundingClientRect();
      const g = gate.getBoundingClientRect();
      const { step, max, maxMobile } = BREAKPOINT_RUN.particles;
      const morph = new TextMorph(
        sampleText(from, origin, step),
        sampleText(to, origin, step),
        { x: g.left + g.width / 2 - origin.left, y: g.top + g.height / 2 - origin.top },
        mw < 768 ? maxMobile : max,
      );
      morphs.set(k, morph);
      return morph;
    };

    const draw = (uv: number) => {
      const { k, s } = locate(uv, count);
      const state = stateAt(s);

      tctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const headPt = drawPulse(tctx, tw, th, uv, count, traceColors);
      const head = headRef.current;
      if (head) {
        head.style.transform = `translate(${headPt.x}px, ${headPt.y}px)`;
        head.dataset.state = headPt.state;
      }
      if (shown !== `${k}:${state}`) {
        shown = `${k}:${state}`;
        if (counterRef.current) counterRef.current.textContent = `breakpoint ${pad(k + 1)} / ${pad(count)}`;
        if (statusRef.current) {
          statusRef.current.textContent = STATUS[state];
          statusRef.current.dataset.state = state;
        }
      }

      mctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (s >= P.dissolve[0] && s < P.land[1]) {
        mctx.clearRect(0, 0, mw, mh);
        const alpha = ramp(P.dissolve[0], P.dissolve[1], s) * (1 - ramp(P.land[0], P.land[1], s));
        (morphs.get(k) ?? build(k))?.draw(mctx, ramp(P.morph[0], P.morph[1], s), alpha, tones);
        dirty = true;
      } else if (dirty) {
        mctx.clearRect(0, 0, mw, mh);
        dirty = false;
      }
    };

    size();
    draw(u.get());
    const unsubscribe = u.on("change", draw);
    const ro = new ResizeObserver(() => {
      size();
      draw(u.get());
    });
    ro.observe(stage);
    ro.observe(traceCanvas);
    return () => {
      unsubscribe();
      ro.disconnect();
    };
  }, [count, u]);

  // Tabbing into a breakpoint that isn't on stage: scroll to where it has resolved.
  const onFocus = (e: FocusEvent<HTMLOListElement>) => {
    const slide = (e.target as HTMLElement).closest<HTMLElement>("[data-bp]");
    const runway = runwayRef.current;
    if (!slide || !runway) return;
    const i = Number(slide.dataset.bp);
    if (locate(u.get(), count).k === i) return;
    const top = runway.getBoundingClientRect().top + window.scrollY + ((i + 0.88) / count) * (runway.offsetHeight - window.innerHeight);
    window.scrollTo({ top, behavior: "instant" });
  };

  return (
    <div ref={runwayRef} className="relative mt-12" style={{ height: `${count * BREAKPOINT_RUN.segmentVh + 100}vh` }}>
      <div ref={stageRef} className="sticky top-0 flex h-screen flex-col">
        <ol
          aria-label="Breakpoints"
          onFocus={onFocus}
          className="grid min-h-0 flex-1 items-center pt-[max(5.5rem,calc(104*var(--u)+1rem))]"
        >
          {items.map((item, i) => (
            <Slide key={`${item.project}/${item.slug}`} item={item} index={i} count={count} u={u} />
          ))}
        </ol>

        <canvas ref={morphRef} aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" />

        <div aria-hidden className="bp-monitor">
          <div className="bp-monitor-bleed">
            <canvas ref={traceRef} className="absolute inset-0 h-full w-full" />
            <span ref={headRef} className="bp-monitor-head" data-state="running" />
          </div>
          <div className="bp-monitor-readout">
            <span ref={counterRef}>breakpoint 01 / {pad(count)}</span>
            <span ref={statusRef} className="bp-status" data-state="running">
              {STATUS.running}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

function Slide({ item, index, count, u }: { item: BreakpointItem; index: number; count: number; u: MotionValue<number> }) {
  const ref = useRef<HTMLLIElement>(null);
  const s = useTransform(u, (v) => v - index);
  const first = index === 0;
  const last = index === count - 1;
  const date = new Date(item.date + "T00:00:00");

  // In at the start of its stretch, out at the end (the first and last stay put at the ends of the run).
  const opacity = useTransform(s, (v) => (first ? 1 : ramp(0, 0.05, v)) * (last ? 1 : 1 - ramp(P.exit, 1, v)));
  const y = useTransform(s, (v) => (first ? 0 : (1 - ramp(0, 0.05, v)) * 28) - (last ? 0 : ramp(P.exit, 1, v) * 28));
  const pointerEvents = useTransform(s, (v) => (v >= 0 && (v < 1 || last) ? "auto" : "none"));

  // The challenge reddens, hands over to its particles, and comes back as a ghost once fixed.
  const challengeOpacity = useTransform(
    s,
    (v) => 1 - ramp(P.dissolve[0], P.dissolve[1], v) + 0.42 * ramp(P.resolved + 0.02, P.resolved + 0.1, v),
  );
  const challengeColor = useTransform(s, (v) => {
    const pct = v < P.resolved ? ramp(P.exception, P.flatline - 0.04, v) * 100 : 0;
    return `color-mix(in srgb, var(--hue-rose) ${Math.round(pct)}%, var(--fg-muted))`;
  });
  // The solution arrives teal from its particles and cools to white.
  const solutionOpacity = useTransform(s, (v) => ramp(P.land[0], P.land[1], v));
  const solutionColor = useTransform(s, (v) => {
    const pct = (1 - ramp(P.resolved, P.resolved + 0.12, v)) * 100;
    return `color-mix(in srgb, var(--hue-teal) ${Math.round(pct)}%, var(--fg))`;
  });

  // One attribute drives the CSS states: labels, gate, glitch.
  useMotionValueEvent(s, "change", (v) => {
    if (ref.current) ref.current.dataset.state = stateAt(v);
  });

  return (
    <motion.li ref={ref} data-bp={index} data-state="running" className="bp-slide" style={{ opacity, y, pointerEvents }}>
      <article>
        <header className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <span aria-hidden className="font-mono text-xs text-fg-subtle">
            {pad(index + 1)}
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

        <h3 className="mt-4 text-2xl">
          <Link href={`/projects/${item.project}/log#${item.slug}`} className="hue-text">
            {item.title}
          </Link>
        </h3>

        <div className="mt-7 grid gap-5 md:mt-10 md:grid-cols-[1fr_4.5rem_1fr] md:gap-4">
          <div className="bp-side" data-side="challenge">
            <p className="bp-label">
              <i aria-hidden />
              Challenge
            </p>
            <motion.p data-text="challenge" className="bp-text mt-3" style={{ opacity: challengeOpacity, color: challengeColor }}>
              {item.challenge}
            </motion.p>
          </div>
          <div data-gate aria-hidden className="bp-gate">
            <i />
          </div>
          <div className="bp-side" data-side="solution">
            <p className="bp-label">
              <i aria-hidden />
              Solution
            </p>
            <motion.p data-text="solution" className="bp-text mt-3" style={{ opacity: solutionOpacity, color: solutionColor }}>
              {item.solution}
            </motion.p>
          </div>
        </div>

        <div className="mt-7 md:mt-10">
          <Link href={`/projects/${item.project}/log#${item.slug}`} className="ghost text-sm">
            Read the full log →
          </Link>
        </div>
      </article>
    </motion.li>
  );
}
