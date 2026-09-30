/**
 * config/motion.ts — every tunable number in the site lives here.
 *
 * Conventions
 *  - Fractions are 0→1 unless a unit is stated.
 *  - "vh"/"vw" suffixes mean the value is multiplied by viewport size at runtime.
 *  - Colours are NOT here: they come from styles/tokens.css.
 */

/* ------------------------------------------------------------------ */
/* 1. Global scroll                                                     */
/* ------------------------------------------------------------------ */

/** Lenis interpolation. Lower = floatier. 0.08 ≈ ~200ms settle at 60fps. */
export const LENIS_LERP = 0.08;

/** Spring applied to each section's local scroll progress, so motion trails the scroll. */
export const SECTION_SPRING = { stiffness: 90, damping: 24, mass: 0.6 } as const;

/** Subset of motion's (unexported) ScrollOffset type that we use: "<edge> <edge>" where edge is a name or a 0–1 fraction. */
type Edge = "start" | "end" | "center" | `${number}`;
export type SectionOffset = `${Edge} ${Edge}`[];

/* ------------------------------------------------------------------ */
/* 2. The stage — scroll-scrubbed footage, handed into About            */
/* ------------------------------------------------------------------ */
/**
 * The clip: closed double doors with a seam of light (0–1.9 s) → the seam
 * cracks and the leaves swing open (1.9–5 s) → a backlit figure walks through
 * toward the camera (3–10 s). 1280×720 @ 24 fps, 10 s, silent.
 *
 * Encoded for scrubbing: keyint=4, no B-frames, so a
 * seek decodes at most three extra frames; +faststart; watermark removed.
 * Re-encode with the same flags if the clip changes.
 */
export const INTRO = {
  /** Public path of the footage. */
  src: "/video/intro.mp4",
  /** Lighter 960×540 encode for phones / Save-Data. */
  srcMobile: "/video/intro-540.mp4",
  /** First frame, painted under the video until it is ready to scrub. */
  poster: "/video/intro-poster.jpg",
  /** Last frame: stands in for the footage from the end of the intro on if it never loaded. */
  posterEnd: "/video/intro-end.jpg",
  /** The last frame pre-blurred and pre-darkened: the ambient plate under the later sections (no live blur). */
  ambient: "/video/intro-ambient.jpg",
  /** Scroll length of the intro, in vh. Longer = slower scrub. */
  heightVh: 400,
  /**
   * Extra pinned scroll (vh) after the intro, during which the figure is
   * carried from the full-screen shot into the About section's plate.
   * The hero track is heightVh + handoffVh tall.
   */
  handoffVh: 90,
  /** Hero progress range mapped onto the footage (0 → duration). */
  video: { start: 0, end: 1.0 },
  /** Per-frame easing of currentTime toward the scroll target (spec: 0.115). */
  ease: 0.115,
  /** Max px counter-scroll drift on the text panels. */
  drift: 22,
  /**
   * Text panels: [fadeInStart, fadeInEnd, fadeOutStart, fadeOutEnd] in hero
   * progress, timed to the footage (progress × 10 s):
   *   1  tagline    — under the name on the closed door; gone as the seam cracks (1.2–2 s)
   *   2  what I do  — the leaves are open, the figure appears (3.2–4 s → 5.6–6.4 s)
   *   3  come in    — the figure is close (7.6–8.6 s) and stays
   * Gaps between panels are deliberate: footage only.
   */
  cues: [
    [0.0, 0.0, 0.12, 0.2],
    [0.32, 0.4, 0.56, 0.64],
    [0.76, 0.86, 1.1, 1.2],
  ] as [number, number, number, number][],
  /**
   * The name, drawn in particles above the panels. It sits centred over the
   * closed door and slides to the gutter while the leaves swing open (1.9–5 s):
   * `slide` is that stretch in hero progress. Horizontal only — the row never
   * moves up or down. `particles` feeds ParticleText (px / ms); `scatter` stays
   * inside the canvas bleed around the name (.hero-name-canvas).
   */
  name: {
    slide: [0.18, 0.42] as [number, number],
    particles: { size: 2, density: 2, scatter: 64, gatherMs: 1600, stagger: 420, repel: 26, repelRadius: 90, drift: 0.6 },
  },
  /** Pointer parallax on the plate: scale-up that leaves room to drift, and max drift (fraction of the viewport). */
  parallax: { scale: 1.06, x: 0.018, y: 0.012 },
  /** Give up on the blob preload after this many ms and stream instead. */
  preloadTimeoutMs: 15000,
} as const;

/* ------------------------------------------------------------------ */
/* 3. Portrait spotlight (About)                                        */
/* ------------------------------------------------------------------ */
export const PORTRAIT = {
  /** Spotlight radius (px on screen) by viewport width. */
  radius: { sm: 120, md: 160, lg: 260 },
  /**
   * The face, as a fraction of the 1280×720 frame (the reveal PNG is
   * composited in that frame space, so this is viewport-independent). The
   * portrait stays dark until the pointer finds the plate; until then a
   * pulsing marker sits here to say there is something to find.
   */
  face: { x: 656 / 1280, y: 100 / 720 },
  /**
   * Spotlight damping rates (1/s, frame-rate independent): how tightly the
   * light trails the pointer, how fast it opens on entering the plate, and
   * how fast it closes on leaving.
   */
  follow: 16,
  open: 7,
  close: 5,
  /** Touch has no hover: the light follows the finger and lingers this long (ms) after it lifts. */
  touchLingerMs: 1200,
  /** Word pull-up stagger (s). */
  wordStagger: 0.08,
} as const;

/* ------------------------------------------------------------------ */
/* 4. Curved scroll path                                                */
/* ------------------------------------------------------------------ */

/** Default bend for useCurvePath. 0 = straight diagonal, 1 = strong arc. */
export const CURVE_BEND_DEFAULT = 0.6;

/** Opacity finishes fading in at this fraction of the path. */
export const CURVE_OPACITY_END = 0.3;

export const CURVE_ROTATE_Z: [number, number] = [-8, 0]; // deg
export const CURVE_SCALE: [number, number] = [0.85, 1];
export const CURVE_TRANSLATE_Z: [number, number] = [-240, 0]; // px, needs parent perspective
export const CURVE_PERSPECTIVE_PX = 1200;

/* ------------------------------------------------------------------ */
/* 5. Sections                                                          */
/* ------------------------------------------------------------------ */

/** Scroll cue: bounce amplitude (px) scales with |velocity| / this value. */
export const SCROLL_CUE = { velocityScale: 1400, maxBounce: 18 } as const;

/** Timeline entries: translateZ per side so nearer ones parallax faster (px). */
export const TIMELINE = { bend: 0.55, zNear: 60, zFar: -120, activeScale: 1.18 } as const;

export const SKILLS_SPHERE = {
  radius: 240,          // px
  baseSpeed: 0.12,      // rad/s idle rotation
  velocityGain: 0.0009, // rad/s per px/s of scroll velocity
  maxSpeed: 2.4,        // rad/s cap
  hoverPop: 1.25,       // scale of the hovered pill
  dimOthers: 0.35,      // opacity of non-hovered pills
} as const;

/**
 * Skills constellation (WebGL). Every skill is a star on one of three nested
 * shells, linked to its nearest neighbours; the cluster spins with scroll,
 * tilts toward the pointer and assembles from the centre on first view.
 * Units are metres; the camera looks down -Z at the origin.
 */
export const SKILLS_CLUSTER = {
  camera: { fov: 34, z: 10.2 },
  /** Shell radius per weight: the things reached for most sit on the outer shell. */
  shell: { 1: 1.5, 2: 2.05, 3: 2.55 } as Record<1 | 2 | 3, number>,
  /** Star size per weight (world units of glow diameter) and the crisp core as a fraction of it. */
  star: { 1: 0.44, 2: 0.6, 3: 0.8 } as Record<1 | 2 | 3, number>,
  core: 0.26,
  /** Nearest neighbours each star links to. */
  links: 3,
  linkOpacity: 0.32,
  /** Idle spin (rad/s), scroll-velocity gain (rad/s per px/s), cap. */
  baseSpeed: 0.09,
  velocityGain: 0.0008,
  maxSpeed: 2.2,
  /** Resting lean (rad) and pointer tilt at full deflection (rad), with its damping rate. */
  lean: 0.3,
  tilt: { x: 0.28, y: 0.34, damp: 3 },
  /** Orbit rings: radius, tilt (rad, about X then Z) and spin (rad/s). */
  rings: [
    { r: 3.05, tilt: [1.2, 0.25] as [number, number], speed: 0.05 },
    { r: 3.45, tilt: [0.45, -1.05] as [number, number], speed: -0.035 },
  ],
  /** Dust: count, radial range, drift (rad/s). */
  dust: { count: 160, range: [3.4, 5.6] as [number, number], drift: 0.02, size: 0.09 },
  /** Assembly on first view: seconds per star, stagger between stars (s). */
  intro: { duration: 1.1, stagger: 0.035 },
  /** Hover: the star's flare, and how far the rest dims. */
  hoverFlare: 1.9,
  dimOthers: 0.3,
  /** Label scale between the back and the front of the cluster. */
  labelScale: [0.74, 1.04] as [number, number],
  /** Label opacity between the back and the front. */
  labelAlpha: [0.28, 1] as [number, number],
} as const;

/** Project cards. `coverParallaxPx`: how far the cover drifts inside its frame as the card crosses the rail. */
export const PROJECT_CARD = {
  tiltDeg: 10,
  tiltSpring: { stiffness: 220, damping: 22, mass: 0.6 },
  coverParallaxPx: 34,
  hoverLift: -10,
} as const;

/**
 * Projects rail: the cards pinned as a staircase, each `step` of a card's
 * height below the one before, so scrolling down carries them right → left
 * and up the diagonal. A card's pose comes from n, its centre's distance from
 * the stage centre in half-stage widths (0 = centred, ±1 = at an edge): it
 * swings (rotateY), sinks back (translateZ) and dims.
 */
export const PROJECT_RAIL = {
  /** Vertical scroll per px of horizontal travel. 1 = the cards move as far as the page scrolls. */
  pace: 1,
  /** Spring on the rail's progress, on top of Lenis. */
  spring: { stiffness: 140, damping: 28, mass: 0.5, restDelta: 0.0005 },
  /** The rail slides in from the right while the section rises into view (fraction of the stage width). */
  enter: 0.35,
  /** How far each card sits below the previous one, as a fraction of a card's height. */
  step: 0.5,
  /** Pose at |n| = 1. */
  swingDeg: 30,
  depthPx: 240,
  /** How far an off-centre card fades (0–1) at |n| = 1. */
  dim: 0.6,
  /** The pose stops changing past this |n|. */
  maxN: 1.6,
  /** Lean into fast scrolls: skew (deg) per 1000 px/s of rail speed, capped, sprung back upright. */
  skewPerKpx: 1.6,
  maxSkewDeg: 6,
  skewSpring: { stiffness: 200, damping: 28, mass: 0.6 },
  /** The stroked title behind the cards travels at this fraction of their speed. */
  backdropRate: 0.35,
  perspectivePx: 1300,
} as const;

/** Scroll choreography (featured covers) — how tall the pinned section is, in vh. */
export const CHOREO = {
  heightVh: 260,
  spring: { stiffness: 400, damping: 50, mass: 1.2, restDelta: 0.001 },
} as const;

/** Build-log entries: subtle curve. */
export const LOG_ENTRY = { bend: 0.25 } as const;

/** Magnetic CTA. */
export const MAGNET = { radius: 140, strength: 0.45, spring: { stiffness: 260, damping: 18, mass: 0.5 } } as const;
