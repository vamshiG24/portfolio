export type TimelineEntry = {
  id: string;
  /** e.g. "2024 — now" */
  period: string;
  title: string;
  org: string;
  summary: string;
  /** Optional bullets rendered under the summary. */
  highlights?: string[];
  /** "work" | "education" | "milestone" — drives the node glyph. */
  kind: "work" | "education" | "milestone";
};

/** Newest first. From content/site.tex. */
export const timeline: TimelineEntry[] = [
  {
    id: "iitm-exchange",
    period: "2026 — 2027",
    title: "B.Tech final-year exchange (MoU)",
    org: "Indian Institute of Technology Madras · Chennai",
    summary: "Final year of the B.Tech on exchange at IIT Madras.",
    kind: "education",
  },
  {
    id: "iitm-research",
    period: "May — Jul 2026",
    title: "Research Intern — LLM watermarking via pseudorandom codes",
    org: "Indian Institute of Technology Madras · Chennai",
    summary:
      "Studied watermarking of large-language-model output using pseudorandom codes (PRCs): secure, robust text watermarks that survive editing.",
    highlights: [
      "Reed–Solomon and folded Reed–Solomon codes, list-recovery algorithms",
      "Cryptographic proofs of soundness, undetectability and adaptive robustness",
    ],
    kind: "work",
  },
  {
    id: "gate",
    period: "2026",
    title: "GATE qualified — Computer Science & Engineering",
    org: "Graduate Aptitude Test in Engineering",
    summary: "National-level qualification in CS&E.",
    kind: "milestone",
  },
  {
    id: "iiitm",
    period: "2023 — 2027",
    title: "B.Tech, Computer Science & Engineering (AI & Data Science)",
    org: "Indian Institute of Information Technology Manipur",
    summary: "CPI 8.10. Coursework and projects across systems, security and applied machine learning.",
    kind: "education",
  },
  {
    id: "intermediate",
    period: "2021 — 2023",
    title: "Intermediate (Class XII) — 97%",
    org: "Sri Chaitanya Junior College · Vijayawada",
    summary: "Mathematics, physics and chemistry stream.",
    kind: "education",
  },
];
