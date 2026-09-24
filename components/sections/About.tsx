"use client";

import { useInView } from "motion/react";
import { useRef, type CSSProperties } from "react";
import { PORTRAIT } from "@/config/motion";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

/**
 * Portrait section. The plate is not here: the intro's figure is carried into
 * this section by the fixed stage (see background/stage/VideoStage), which
 * measures the plate anchor below to know where to land. The real portrait
 * stays dark until the pointer is over the plate, then a spotlight under the
 * cursor reveals it through the silhouette. The section is transparent so that
 * plate shows through. Headline words pull up one by one on first view;
 * everything else fades up with a stagger. The card's thumbnail is likewise a
 * blur until the card is hovered.
 */
export function About() {
  const { about } = site;
  const root = useRef<HTMLElement>(null);
  const inView = useInView(root, { amount: 0.25, once: true });

  return (
    <section
      ref={root}
      id="about"
      aria-labelledby="about-title"
      className={cn("relative z-10 isolate min-h-svh overflow-hidden", inView && "is-in")}
    >
      {/* plate anchor: where the stage lands the figure (full height on the right; the top band on narrow screens) */}
      <div
        data-about-plate
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[62svh] lg:inset-y-0 lg:left-auto lg:right-0 lg:h-auto lg:w-[clamp(20rem,46vw,46rem)]"
      />
      <span className="sr-only-keep">{about.portrait.alt}</span>

      <div className="container-page relative grid min-h-svh grid-rows-[auto_1fr_auto] gap-8 py-28 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)]">
        {/* copy */}
        <div className="lg:col-start-1 lg:row-span-3 flex flex-col justify-between gap-8">
          <div className="max-w-[34rem]">
            <p className="eyebrow mb-5 fade-up" style={delay(0.2)}>
              01 — About
            </p>
            <h2 id="about-title" className="text-3xl uppercase leading-[1.05] tracking-tight">
              {about.lines.map((line, li) => (
                <span key={li} className="block">
                  <Words text={line} offset={about.lines.slice(0, li).join(" ").split(/\s+/).filter(Boolean).length} />
                </span>
              ))}
            </h2>
            <p className="about-bio fade-up mt-5 max-w-[38ch] text-base leading-relaxed text-fg-muted" style={delay(0.5)}>
              {about.bio}
            </p>
            <ul className="fade-up mt-6 flex gap-2.5" style={delay(0.65)} aria-label="Links">
              {site.socials.map((s) => (
                <li key={s.label}>
                  <a
                    href={s.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={s.label}
                    className="ring-btn grid h-10 w-10 place-items-center rounded-full border border-line-strong text-fg"
                  >
                    <SocialGlyph label={s.label} />
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <article
            className="face-card hue-group fade-up rule rule-glow grid w-full max-w-[24rem] grid-cols-[4.5rem_1fr] gap-x-4 gap-y-2 pt-4"
            style={delay(0.95)}
          >
            <div aria-hidden className="relative row-span-2 h-[4.5rem] w-[4.5rem] overflow-hidden rounded-md bg-bg-elev">
              <div className="face-thumb absolute inset-0 bg-cover bg-[50%_18%]" style={{ backgroundImage: `url(${about.portrait.thumb})` }} />
              <svg className="face-thumb-hint absolute inset-0 m-auto text-fg-muted" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
            <div>
              <h3 className="text-xs uppercase tracking-(--tracking-wide) text-fg">{about.card.title}</h3>
              <p className="mt-1 text-sm leading-snug text-fg-muted">{about.card.text}</p>
            </div>
            <a href="#contact" className="ghost justify-self-start self-end text-sm">
              {about.card.cta} →
            </a>
          </article>
        </div>

        {/* page index */}
        <p className="fade-up lg:col-start-2 lg:row-start-1 lg:justify-self-end font-mono text-xs tracking-(--tracking-wide) text-fg-muted" style={delay(0.75)}>
          01 / 06
        </p>
      </div>
    </section>
  );
}

const delay = (s: number): CSSProperties => ({ animationDelay: `${s}s` });

/** Word-by-word pull-up; `offset` keeps one stagger index running across lines. */
function Words({ text, offset }: { text: string; offset: number }) {
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <>
      {words.map((w, i) => (
        <span key={i} className={cn("pull-word inline-block", i < words.length - 1 && "mr-[0.3em]")} style={{ animationDelay: `${(offset + i) * PORTRAIT.wordStagger}s` }}>
          {w}
        </span>
      ))}
    </>
  );
}

function SocialGlyph({ label }: { label: string }) {
  const common = { width: 16, height: 16, viewBox: "0 0 16 16", fill: "none", stroke: "currentColor", strokeWidth: 1.2, "aria-hidden": true } as const;
  if (/github/i.test(label)) return <svg {...common}><path d="M8 1.4L13.8 4.7V11.3L8 14.6L2.2 11.3V4.7L8 1.4Z" /><circle cx="8" cy="8" r="1.35" fill="currentColor" /></svg>;
  if (/linkedin/i.test(label)) return <svg {...common}><path d="M2 5.2V2h3.2M14 5.2V2h-3.2M2 10.8V14h3.2M14 10.8V14h-3.2" strokeLinecap="round" /><rect x="5.2" y="5.2" width="5.6" height="5.6" /></svg>;
  return <svg {...common}><path d="M9.2 1.6L4 9.1h3.5L6.8 14.4 12 6.9H8.5L9.2 1.6Z" strokeLinejoin="round" /></svg>;
}
