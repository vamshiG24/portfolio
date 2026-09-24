/** Site-wide identity — filled from content/site.tex (resume) and GitHub. */
export const site = {
  name: "Gowni Vamshi",
  role: "Full-stack & AI systems engineer",
  tagline: "I build full-stack web apps and LLM-powered systems with secure backends, clean service architecture, and AI you can actually rely on.",
  /** Short line for the intro panel (the long tagline is for metadata + About). */
  heroLine: "Secure backends. Reliable AI. Interfaces with real craft.",
  location: "Bengaluru",
  email: "vamshigowniv26@gmail.com",
  socials: [
    { label: "GitHub", href: "https://github.com/vamshiG24" },
    { label: "LinkedIn", href: "https://www.linkedin.com/in/vamshi-gowni-8bba28322" },
  ],
  /** About / portrait section. */
  about: {
    /** Three short display lines (word-by-word pull-up). */
    lines: ["Secure backends //", "Reliable AI", "systems"],
    bio: "Computer Science undergraduate at IIIT Manipur, now on a final-year exchange at IIT Madras, where I interned on LLM watermarking via pseudorandom codes. I care about backends that hold up under scrutiny — chain-of-custody ledgers, RBAC, 2FA — and AI integrations that fail over gracefully instead of falling over.",
    /** The card thumbnail, kept blurred until hovered (the full photo lives in assets/photo, the source of the reveal below). */
    portrait: { thumb: "/myimage/vamshi-thumb.jpg", alt: "Portrait of Gowni Vamshi" },
    /**
     * The portrait cut out and composited onto the intro figure in the clip's
     * 1280×720 frame space (head on head, collar on shoulders), so the
     * spotlight reveals face for face and chest for chest. Dark until hovered.
     */
    reveal: { src: "/myimage/about-reveal.png" },
    /** Small card under the copy. */
    card: {
      title: "Now",
      text: "Final-year B.Tech (AI & Data Science) · IIT Madras exchange 2026–27 · ex-Research Intern, IIT Madras.",
      cta: "Get in touch",
    },
  },
  nav: [
    { id: "home", label: "Home" },
    { id: "about", label: "About" },
    { id: "timeline", label: "Timeline" },
    { id: "skills", label: "Skills" },
    { id: "projects", label: "Projects" },
    { id: "breakpoints", label: "Breakpoints" },
    { id: "contact", label: "Contact" },
  ],
} as const;

export type NavId = (typeof site.nav)[number]["id"];
