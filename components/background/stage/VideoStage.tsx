"use client";

import {
  cancelFrame,
  frame as frameloop,
  motion,
  useAnimationFrame,
  useMotionValue,
  useMotionValueEvent,
  useReducedMotion,
  useSpring,
  useTransform,
  type FrameData,
} from "motion/react";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { INTRO, PORTRAIT } from "@/config/motion";
import { site } from "@/content/site";
import { bgStore } from "@/lib/bgStore";
import { clamp, damp, smoothstep } from "@/lib/rig";
import { useDeviceTier } from "@/hooks/useDeviceTier";
import { useMounted } from "@/hooks/useMounted";
import { useScrollContext } from "@/providers/ScrollProvider";

const GRAIN =
  "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3'/></filter><rect width='140' height='140' filter='url(%23n)' opacity='.5'/></svg>\")";

/* The About plate's studio grade: a vignette that swallows the edges, then the plate fades into the stage. Plain alpha, no blend modes. */
const VIGNETTE = "radial-gradient(ellipse 64% 62% at 50% 30%, transparent 0%, rgba(5,5,5,0.3) 52%, rgba(5,5,5,0.92) 100%)";
const EDGE_FADE = "linear-gradient(to bottom, transparent 55%, var(--bg) 100%), linear-gradient(to right, var(--bg) 0%, transparent 28%)";
/* The hero's letterbox: bottom fade + side fades baked into the plate (spec 1). */
const LETTERBOX =
  "linear-gradient(to bottom, rgba(5,5,5,0) 72%, rgba(5,5,5,0.45) 84%, rgba(5,5,5,0.9) 100%), linear-gradient(to right, var(--bg) 0%, transparent 12%, transparent 88%, var(--bg) 100%)";

/** The spotlight's mask with no light in it: the portrait fully hidden. */
const HIDDEN = "radial-gradient(circle 0px at -999px -999px, #fff, transparent)";
/** Pointing at one of these is not looking at the portrait, even where it sits over the plate. */
const CONTROLS = "a, button, input, textarea, select, label, [role='button']";

const ASPECT = 16 / 9;
/** Size the 16:9 frame is drawn at to cover a w×h box (object-fit: cover, centred). */
const coverBox = (w: number, h: number) => (w / h > ASPECT ? { w, h: w / ASPECT } : { w: h * ASPECT, h });

/** Lighter encode on small viewports and when the browser asks to save data. */
function pickSource(): string {
  const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
  const small = window.matchMedia("(max-width: 900px)").matches;
  return small || conn?.saveData ? INTRO.srcMobile : INTRO.src;
}

type Layout = {
  vw: number;
  vh: number;
  /** Document y of the About section: Infinity until measured, null on pages without one. */
  aboutTop: number | null;
  /** The plate anchor's box in About-section coordinates. */
  rect: { left: number; top: number; w: number; h: number };
  /** Scale and centre offset that map the full-screen cover box onto the rect's cover box. */
  s: number;
  dx: number;
  dy: number;
};

/** Everything the stage draws, derived from scrollY + the hand-off amount. */
type Frame = {
  /** Hand-off amount, eased (0 full-screen … 1 in the About rect). */
  k: number;
  /** Wrapper: follows the About section up once it scrolls. */
  follow: number;
  clip: string;
  /** The clip window itself (wrapper coordinates): the plate's grade is drawn over exactly this box. */
  win: { left: number; top: number; w: number; h: number };
  /** Plate transform. `scale` is the whole of it, parallax zoom included — the spotlight maths uses it too. */
  x: number;
  y: number;
  scale: number;
  /** The baked ambient plate (blurred + darkened last frame) over everything else: 0 or 1. */
  ambient: number;
  veil: number;
};

/**
 * Fixed cinematic stage behind the whole page.
 *
 *  - The poster (first frame) paints immediately; the footage fades in over it
 *    once it can scrub, so the first paint already reads as "closed door".
 *  - The footage is fetched as one blob first (seeking inside a buffered blob
 *    is near-instant; range requests over the network are a slideshow), then
 *    scrubbed: scroll sets a target time, a rAF loop eases `currentTime`
 *    toward it (INTRO.ease), which turns a jumpy scrub into a smooth one.
 *  - The plate is scaled up a touch and drifts with the mouse — the same
 *    hand-held parallax the 3D door had.
 *  - Hand-off: over the pinned stretch after the intro (bgStore.handoff) the
 *    plate translates, scales and clips from the full screen into the About
 *    plate's rect (measured from About's anchor), swapping the letterbox for
 *    the plate's studio grade. It holds there while About rises around it,
 *    follows About up as it scrolls, dims as it leaves, and only then gives
 *    way to the ambient plate the later sections sit on — a pre-blurred,
 *    pre-darkened image, so no live blur is ever composited.
 *  - Reveal: the portrait, composited in the clip's frame space, sits inside
 *    the same plate and is masked by a pointer spotlight — so the light finds
 *    face for face and chest for chest. It stays dark until the pointer (or a
 *    finger) is over the landed plate, opens there, trails the pointer, and
 *    closes when it leaves; a pulsing marker on the face says there is
 *    something to find. Under reduced motion the portrait fades in whole.
 *  - Pages without the hero (the build logs) get the ambient state straight
 *    away, from the last-frame poster, and never fetch the footage.
 */
export function VideoStage() {
  const video = useRef<HTMLVideoElement>(null);
  const reveal = useRef<HTMLDivElement>(null);
  // Gated behind mount so the stage renders identically on the server and during hydration.
  const mounted = useMounted();
  const reduced = (useReducedMotion() ?? false) && mounted;
  const tier = useDeviceTier();
  const { scrollY } = useScrollContext();
  const progress = bgStore.heroProgress;
  const pathname = usePathname();
  // The layout keeps this stage mounted across navigations; only the home page has the hero.
  const hasHero = pathname === "/";

  const duration = useRef(0);
  const seekTo = useRef(0);
  const seekAt = useRef(0);
  // Latest motion preference for the one-shot load effect below.
  const reducedRef = useRef(false);
  reducedRef.current = reduced;
  const [ready, setReady] = useState(false);
  const loadedOnce = useRef(false);

  // Hero progress → target time (kept a hair short of the end: the very last
  // sample paints black in some engines).
  useMotionValueEvent(progress, "change", (p) => {
    const { start, end } = INTRO.video;
    const t = clamp((p - start) / (end - start), 0, 1);
    seekTo.current = t * Math.max(0, duration.current - 0.05);
  });

  // Eased scrub. Under reduced motion the last frame holds (set once on load).
  useAnimationFrame(() => {
    const v = video.current;
    if (!v || !ready || !duration.current || reducedRef.current) return;
    const gap = seekTo.current - seekAt.current;
    if (Math.abs(gap) > 0.0008) {
      seekAt.current += gap * INTRO.ease;
      if (v.readyState >= 2 && !v.seeking) {
        try {
          v.currentTime = seekAt.current;
        } catch {}
      }
    }
  });

  // Blob preload → attach → ready. Falls back to streaming on timeout / CORS / offline.
  // Only once there is a hero to scrub, and only once (the guard sticks when the
  // source is attached, so a cleanup mid-fetch — StrictMode's double effect — retries).
  // The fetch waits for the page's load event: the poster is already up, and 3 MB
  // must not race the fonts and the first paint.
  useEffect(() => {
    const v = video.current;
    if (!v || !hasHero || loadedOnce.current) return;
    const src = pickSource();
    let attached = false;
    let cancelled = false;
    let bail = 0;
    const ctrl = typeof AbortController !== "undefined" ? new AbortController() : null;

    const start = () => {
      if (cancelled) return;
      setReady(true);
      bgStore.introLoad.set(1);
      seekAt.current = seekTo.current;
    };
    const attach = (url: string) => {
      if (attached || cancelled) return;
      attached = true;
      loadedOnce.current = true;
      v.addEventListener("loadedmetadata", () => {
        duration.current = v.duration || 0;
        v.pause();
        const { start: s, end: e } = INTRO.video;
        const end = Math.max(0, duration.current - 0.05);
        seekTo.current = clamp((progress.get() - s) / (e - s), 0, 1) * end;
        seekAt.current = seekTo.current;
        try {
          v.currentTime = reducedRef.current ? end : seekAt.current;
        } catch {}
      });
      v.addEventListener("loadeddata", start);
      v.addEventListener("canplaythrough", start);
      v.addEventListener("error", start);
      v.src = url;
      v.load();
      window.setTimeout(start, 12000);
    };

    const begin = () => {
      if (cancelled) return;
      bail = window.setTimeout(() => {
        if (!attached) {
          ctrl?.abort();
          attach(src);
        }
      }, INTRO.preloadTimeoutMs);
      fetch(src, { signal: ctrl?.signal })
      .then(async (res) => {
        if (!res.ok || !res.body) throw new Error("bad response");
        const total = Number(res.headers.get("content-length")) || 0;
        const reader = res.body.getReader();
        const chunks: BlobPart[] = [];
        let got = 0;
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          if (value) {
            chunks.push(value);
            got += value.byteLength;
            bgStore.introLoad.set(total ? got / total : Math.min(got / 6e6, 0.95));
          }
        }
        return new Blob(chunks, { type: "video/mp4" });
      })
      .then((blob) => {
        window.clearTimeout(bail);
        attach(URL.createObjectURL(blob));
      })
      .catch(() => {
        window.clearTimeout(bail);
        attach(src);
      });
    };
    if (document.readyState === "complete") begin();
    else window.addEventListener("load", begin, { once: true });

    // iOS will not paint a frame from a video that has never played: nudge once.
    const unlock = () => {
      const p = v.play();
      if (p && typeof p.then === "function") p.then(() => v.pause()).catch(() => {});
      else v.pause();
    };
    const evs = ["touchstart", "pointerdown", "wheel", "keydown"] as const;
    evs.forEach((ev) => window.addEventListener(ev, unlock, { once: true, passive: true }));

    return () => {
      cancelled = true;
      window.clearTimeout(bail);
      window.removeEventListener("load", begin);
      ctrl?.abort();
      evs.forEach((ev) => window.removeEventListener(ev, unlock));
    };
    // `progress` is a stable MotionValue; the load is one-shot.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasHero]);

  /* ---- layout: where the About plate is, measured from its anchor ---------------------------- */
  const lay = useRef<Layout>({ vw: 1, vh: 1, aboutTop: Infinity, rect: { left: 0, top: 0, w: 1, h: 1 }, s: 1, dx: 0, dy: 0 });
  // Bumped after each measure so the frame transform below re-evaluates.
  const bump = useMotionValue(0);
  useEffect(() => {
    const about = document.getElementById("about");
    const anchor = about?.querySelector<HTMLElement>("[data-about-plate]");
    if (!hasHero) {
      // Nothing writes these on this page: hold the end of the intro, nothing handed off.
      bgStore.heroProgress.set(1);
      bgStore.handoff.set(0);
    }
    const measure = () => {
      // The stage is fixed inset-0, which excludes the scrollbar — unlike window.innerWidth.
      const vw = document.documentElement.clientWidth || 1;
      const vh = document.documentElement.clientHeight || 1;
      const L = lay.current;
      L.vw = vw;
      L.vh = vh;
      if (about && anchor) {
        const ab = about.getBoundingClientRect();
        const r = anchor.getBoundingClientRect();
        L.aboutTop = ab.top + window.scrollY;
        L.rect = { left: r.left - ab.left, top: r.top - ab.top, w: r.width, h: r.height };
      } else {
        L.aboutTop = null;
        L.rect = { left: 0, top: 0, w: vw, h: vh };
      }
      const b0 = coverBox(vw, vh);
      const b1 = coverBox(L.rect.w, L.rect.h);
      L.s = b1.h / b0.h;
      L.dx = L.rect.left + L.rect.w / 2 - vw / 2;
      L.dy = L.rect.top + L.rect.h / 2 - vh / 2;
      bump.set(bump.get() + 1);
    };
    measure();
    window.addEventListener("resize", measure);
    const ro = about && typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    if (about) ro?.observe(about);
    document.fonts?.ready.then(measure).catch(() => {});
    return () => {
      window.removeEventListener("resize", measure);
      ro?.disconnect();
    };
  }, [bump, pathname, hasHero]);

  /* ---- the frame: one derivation from scroll + hand-off, fanned out into styles ------------------ */
  const frame = useTransform([scrollY, bgStore.handoff, bump], ([y, h]) => {
    const L = lay.current;
    const { vw, vh, rect } = L;
    const full = { left: 0, top: 0, w: vw, h: vh };
    // The ambient plate is pre-darkened, so the veil simply lifts off it.
    const ambient = (t: number): Frame => ({ k: 0, follow: 0, clip: "none", win: full, x: 0, y: 0, scale: INTRO.parallax.scale, ambient: 1, veil: 1 - t });
    // No hero on this page: the ambient state, straight away.
    if (L.aboutTop === null) return ambient(1);
    const exitAt = L.aboutTop + rect.top + rect.h;
    if ((y as number) >= exitAt) {
      // Ambient: full-screen again, the baked plate under a lifting veil. The
      // switch is invisible — the plate has already dimmed to nothing on the way out.
      return ambient(clamp(((y as number) - exitAt) / (vh * 0.5), 0, 1));
    }
    const k = smoothstep(0, 1, h as number);
    const follow = Math.max(0, (y as number) - L.aboutTop);
    const top = Math.max(0, rect.top);
    const right = Math.max(0, vw - rect.left - rect.w);
    const bottom = Math.max(0, vh - (rect.top + rect.h));
    const left = Math.max(0, rect.left);
    const clip = k > 0 ? `inset(${(top * k).toFixed(1)}px ${(right * k).toFixed(1)}px ${(bottom * k).toFixed(1)}px ${(left * k).toFixed(1)}px)` : "none";
    const win = { left: left * k, top: top * k, w: vw - (left + right) * k, h: vh - (top + bottom) * k };
    // Dims over the last 30% of its way out, so it is gone before the ambient switch.
    const veil = clamp((follow - rect.top - rect.h * 0.7) / (rect.h * 0.3), 0, 1);
    // The hero's parallax zoom eases out with the hand-off, so the plate lands as an exact cover of the rect.
    const scale = (1 + (L.s - 1) * k) * (1 + (INTRO.parallax.scale - 1) * (1 - k));
    return { k, follow, clip, win, x: L.dx * k, y: L.dy * k, scale, ambient: 0, veil } satisfies Frame;
  });
  const latest = useRef<Frame>({ k: 0, follow: 0, clip: "none", win: { left: 0, top: 0, w: 1, h: 1 }, x: 0, y: 0, scale: INTRO.parallax.scale, ambient: 0, veil: 0 });
  useMotionValueEvent(frame, "change", (f) => {
    latest.current = f;
  });
  const wrapY = useTransform(frame, (f) => -f.follow);
  const clipPath = useTransform(frame, (f) => f.clip);
  const plateX = useTransform(frame, (f) => f.x);
  const plateY = useTransform(frame, (f) => f.y);
  const plateScale = useTransform(frame, (f) => f.scale);
  const ambientOpacity = useTransform(frame, (f) => f.ambient);
  // The grade comes in early and sits over the clip window, so the window's edges are always inside its fades.
  const gradeOpacity = useTransform(frame, (f) => smoothstep(0, 0.45, f.k));
  const letterOpacity = useTransform(frame, (f) => 1 - smoothstep(0, 0.45, f.k));
  const gradeLeft = useTransform(frame, (f) => f.win.left);
  const gradeTop = useTransform(frame, (f) => f.win.top);
  const gradeWidth = useTransform(frame, (f) => f.win.w);
  const gradeHeight = useTransform(frame, (f) => f.win.h);
  // The portrait (and its hint) exist only once the figure has (all but) landed in About — never over the walk-in.
  const revealOpacity = useTransform(frame, (f) => smoothstep(0.85, 1, f.k));
  // 0 → 1 as the spotlight opens (written by the spotlight below). Under reduced motion there is no
  // spotlight, and this fades the whole portrait instead.
  const lit = useMotionValue(0);
  const revealShown = useTransform([revealOpacity, lit], ([o, l]) => (reducedRef.current ? (o as number) * (l as number) : (o as number)));
  // The hint sits on the face: the frame-space face point through the plate's transform (drift left out: it is 0 once landed).
  const facePoint = (f: Frame) => {
    const L = lay.current;
    const b = coverBox(L.vw, L.vh);
    return { x: L.vw / 2 + f.x + (PORTRAIT.face.x - 0.5) * b.w * f.scale, y: L.vh / 2 + f.y + (PORTRAIT.face.y - 0.5) * b.h * f.scale };
  };
  const hintX = useTransform(frame, (f) => facePoint(f).x);
  const hintY = useTransform(frame, (f) => facePoint(f).y);
  const hintOpacity = useTransform([revealOpacity, lit], ([o, l]) => (o as number) * (1 - (l as number)));
  // Out of the layout while invisible, so its pulse is not ticking under the hero.
  const hintDisplay = useTransform(hintOpacity, (o) => (o > 0.001 ? "block" : "none"));
  const veil = useTransform(frame, (f) => f.veil);
  // Fallback plate for the end of the intro onward, if the footage never loaded (or was never fetched).
  const endOpacity = useTransform(progress, (p) => (ready ? 0 : p > 0.985 ? 1 : 0));

  /* ---- pointer parallax (mouse only, hero only): the plate drifts a little against the cursor --- */
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const spring = { stiffness: 38, damping: 16, mass: 0.9 };
  const sx = useSpring(px, spring);
  const sy = useSpring(py, spring);
  useEffect(() => {
    if (reduced || tier.mobile) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      // Off once the figure starts moving into About (the plate is then locked to layout) and under the sections.
      const off = latest.current.ambient ? 0 : 1 - latest.current.k;
      px.set(-((e.clientX / window.innerWidth) * 2 - 1) * INTRO.parallax.x * off);
      py.set(-((e.clientY / window.innerHeight) * 2 - 1) * INTRO.parallax.y * off);
    };
    const onLeave = () => {
      px.set(0);
      py.set(0);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, tier.mobile, px, py]);
  // The plate is centred and sized to the frame's own cover box (not the viewport), so scaling it by
  // the landing scale maps cover box → cover box: it can never come up short of the About rect.
  const boxW = useTransform(bump, () => coverBox(lay.current.vw, lay.current.vh).w);
  const boxH = useTransform(bump, () => coverBox(lay.current.vw, lay.current.vh).h);
  const driftX = useTransform([plateX, sx], ([x, d]) => `calc(-50% + ${(x as number).toFixed(1)}px + ${((d as number) * 100).toFixed(3)}%)`);
  const driftY = useTransform([plateY, sy], ([y, d]) => `calc(-50% + ${(y as number).toFixed(1)}px + ${((d as number) * 100).toFixed(3)}%)`);

  /* ---- spotlight: dark until the pointer is over the landed plate, then a light that trails it ----- */
  useEffect(() => {
    const el = reveal.current;
    if (!el) return;
    const radius = () => {
      const w = window.innerWidth;
      return w < 480 ? PORTRAIT.radius.sm : w < 720 ? PORTRAIT.radius.md : PORTRAIT.radius.lg;
    };
    // (x, y, r) in the reveal's own space: it sits inside the scaled plate.
    const paint = (x: number, y: number, r: number) => {
      const mask = `radial-gradient(circle ${r.toFixed(1)}px at ${x.toFixed(1)}px ${y.toFixed(1)}px, #fff 0%, #fff 40%, rgba(255,255,255,0.75) 60%, rgba(255,255,255,0.4) 75%, rgba(255,255,255,0.12) 88%, transparent 100%)`;
      el.style.webkitMaskImage = mask;
      el.style.maskImage = mask;
    };
    const hide = () => {
      el.style.webkitMaskImage = HIDDEN;
      el.style.maskImage = HIDDEN;
    };

    // The last pointer position (viewport px); `has` drops when the mouse leaves the window or a finger lifts.
    let px = 0;
    let py = 0;
    let has = false;
    // Over a control (the nav's pill sits over the plate): that is not looking at the portrait.
    let onControl = false;
    let linger = 0;
    // The light itself: position (viewport px) and radius (screen px), damped toward the pointer.
    let lx = 0;
    let ly = 0;
    let lr = 0;

    // Over the plate, with the figure landed there? The plate's window on screen is the clip
    // window, lifted by however far About has scrolled.
    const over = () => {
      const f = latest.current;
      if (!has || onControl || f.ambient || f.k < 0.98 || f.veil > 0.6) return false;
      const top = f.win.top - f.follow;
      return px >= f.win.left && px <= f.win.left + f.win.w && py >= top && py <= top + f.win.h;
    };

    // Runs in motion's render step, after this frame's scroll and frame values, so the light is placed
    // against the plate as it is drawn this frame and never trails a scroll. Viewport → the plate's own
    // space comes from the frame, not from layout reads: the plate is centred, drifted, scaled about
    // its centre, and lifted with the wrapper.
    let running = false;
    const stop = () => {
      running = false;
      cancelFrame(step);
    };
    const step = ({ delta }: FrameData) => {
      const R = radius();
      const target = over() ? R : 0;
      if (lr === 0 && target === 0) return stop();
      const dt = Math.min(delta, 50) / 1000;
      // It opens where the pointer is, rather than sliding in from wherever it last closed.
      if (lr < 0.5) {
        lx = px;
        ly = py;
      }
      lx = damp(lx, px, PORTRAIT.follow, dt);
      ly = damp(ly, py, PORTRAIT.follow, dt);
      lr = damp(lr, target, target > lr ? PORTRAIT.open : PORTRAIT.close, dt);
      if (Math.abs(lr - target) < 0.5) lr = target;
      lit.set(lr / R);
      if (lr === 0) {
        if (!reducedRef.current) hide();
        return stop();
      }
      if (!reducedRef.current) {
        const f = latest.current;
        const L = lay.current;
        const b = coverBox(L.vw, L.vh);
        const cx = L.vw / 2 + f.x + sx.get() * b.w;
        const cy = L.vh / 2 + f.y + sy.get() * b.h - f.follow;
        paint((lx - cx) / f.scale + b.w / 2, (ly - cy) / f.scale + b.h / 2, lr / f.scale);
      }
      // Still: park until the pointer moves or the page scrolls.
      if (lr === target && Math.abs(lx - px) < 0.3 && Math.abs(ly - py) < 0.3) stop();
    };
    const kick = () => {
      if (running) return;
      running = true;
      frameloop.render(step, true);
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return; // fingers are followed through the touch events below
      px = e.clientX;
      py = e.clientY;
      has = true;
      onControl = e.target instanceof Element && !!e.target.closest(CONTROLS);
      kick();
    };
    const onLeave = () => {
      has = false;
      kick();
    };
    // Touch has no hover: the light follows the finger, and lingers a moment after it lifts.
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (!t) return;
      window.clearTimeout(linger);
      px = t.clientX;
      py = t.clientY;
      has = true;
      onControl = e.target instanceof Element && !!e.target.closest(CONTROLS);
      kick();
    };
    const onTouchEnd = () => {
      window.clearTimeout(linger);
      linger = window.setTimeout(onLeave, PORTRAIT.touchLingerMs);
    };
    // The plate moves under a resting pointer as the page scrolls: re-test whenever the frame changes.
    const unsub = frame.on("change", kick);
    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("touchstart", onTouch, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    window.addEventListener("touchend", onTouchEnd, { passive: true });
    window.addEventListener("touchcancel", onTouchEnd, { passive: true });
    return () => {
      unsub();
      stop();
      window.clearTimeout(linger);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("touchstart", onTouch);
      window.removeEventListener("touchmove", onTouch);
      window.removeEventListener("touchend", onTouchEnd);
      window.removeEventListener("touchcancel", onTouchEnd);
    };
  }, [frame, lit, sx, sy]);

  return (
    <div className="absolute inset-0 overflow-hidden bg-bg">
      {/* wrapper: clips to the About rect after the hand-off and follows About up */}
      <motion.div className="absolute inset-0" style={{ y: wrapY, clipPath }}>
        {/* the plate: poster under footage under the reveal, one transform for all */}
        <motion.div
          className="absolute left-1/2 top-1/2 will-change-transform"
          style={{ width: boxW, height: boxH, x: driftX, y: driftY, scale: plateScale }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- background plate under the footage; painted before any JS runs */}
          <img
            src={INTRO.poster}
            alt=""
            aria-hidden
            fetchPriority="high"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ filter: "contrast(1.04)" }}
          />
          {/* fallback for the end of the intro if the footage never loads */}
          <motion.img
            src={INTRO.posterEnd}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: endOpacity, filter: "contrast(1.04)" }}
          />
          <video
            ref={video}
            muted
            playsInline
            preload="auto"
            disablePictureInPicture
            disableRemotePlayback
            aria-hidden
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: ready ? 1 : 0, transition: "opacity 600ms var(--ease-out)", filter: "contrast(1.04)" }}
          />
          {/* reveal: the portrait in frame space, under the spotlight */}
          <motion.div
            ref={reveal}
            className="absolute inset-0"
            style={{ opacity: revealShown, WebkitMaskImage: reduced ? undefined : HIDDEN, maskImage: reduced ? undefined : HIDDEN }}
          >
            {/* eslint-disable-next-line @next/next/no-img-element -- masked plate; same cover geometry as the footage */}
            <img
              src={site.about.reveal.src}
              alt=""
              aria-hidden
              loading="lazy"
              decoding="async"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ filter: "saturate(0.9) contrast(1.04)" }}
            />
          </motion.div>
          {/* ambient: the baked plate the later sections sit on */}
          <motion.img
            src={INTRO.ambient}
            alt=""
            aria-hidden
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover"
            style={{ opacity: ambientOpacity }}
          />
        </motion.div>
        {/* the About plate's grade, over the clip window; takes over from the letterbox as the figure moves */}
        <motion.div
          className="pointer-events-none absolute"
          style={{ left: gradeLeft, top: gradeTop, width: gradeWidth, height: gradeHeight, opacity: gradeOpacity }}
        >
          <div className="absolute inset-0" style={{ background: VIGNETTE }} />
          <div className="absolute inset-0" style={{ background: EDGE_FADE }} />
        </motion.div>
        {/* the hint: a pulse on the face until the light is found */}
        <motion.div className="portrait-hint" style={{ x: hintX, y: hintY, opacity: hintOpacity, display: hintDisplay }}>
          <span className="portrait-hint-ring" />
          <span className="portrait-hint-label">
            <span className="hint-hover">Hover to reveal</span>
            <span className="hint-touch">Touch to reveal</span>
          </span>
        </motion.div>
      </motion.div>
      {/* the hero's letterbox; hands over to the grade */}
      <motion.div className="pointer-events-none absolute inset-0" style={{ background: LETTERBOX, opacity: letterOpacity }} />
      <motion.div className="pointer-events-none absolute inset-0 bg-bg" style={{ opacity: veil }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.07]" style={{ backgroundImage: GRAIN }} />
    </div>
  );
}
