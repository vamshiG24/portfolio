import { SKILLS_CLUSTER } from "@/config/motion";
import { skills, type Skill } from "@/content/skills";
import { fibonacciSphere } from "@/lib/fibonacci";

/* Monochrome: groups differ by tone, not hue (spec 1 palette). AI carries the doorway's warmth. */
export const groupColor: Record<Skill["group"], string> = {
  languages: "#fafafa",
  web: "#d0cfcf",
  backend: "#a7a6a6",
  ai: "#fff0d2",
  devops: "#8b8a8a",
};

/** Hover only: the colour a star, its links and its label take on under the pointer (tokens.css --hue-*). */
export const groupHue: Record<Skill["group"], string> = {
  languages: "#ff5d8f",
  web: "#4cc9f0",
  backend: "#9b7bff",
  ai: "#ffb35c",
  devops: "#5eead4",
};

/** Inline style for a label under the pointer: lit in its group's colour, the way its star is. */
export const hueStyle = (hue: string) => ({
  color: hue,
  borderColor: hue,
  backgroundColor: `color-mix(in srgb, ${hue} 14%, var(--bg))`,
  boxShadow: `0 0 22px -6px ${hue}`,
});

export type Star = {
  skill: Skill;
  /** Unit direction from the centre. */
  dir: [number, number, number];
  /** Shell radius (by weight). */
  radius: number;
  /** Glow diameter (by weight). */
  size: number;
};

export type Link = [number, number];

/**
 * The cluster's layout: directions from one golden-angle spiral (so it is
 * evenly spread), each star pushed out to its weight's shell, and every star
 * linked to its nearest neighbours on the sphere (pairs deduplicated).
 */
export function buildCluster(): { stars: Star[]; links: Link[] } {
  const dirs = fibonacciSphere(skills.length);
  const stars: Star[] = skills.map((skill, i) => ({
    skill,
    dir: [dirs[i].x, dirs[i].y, dirs[i].z],
    radius: SKILLS_CLUSTER.shell[skill.weight],
    size: SKILLS_CLUSTER.star[skill.weight],
  }));

  const seen = new Set<string>();
  const links: Link[] = [];
  stars.forEach((a, i) => {
    const near = stars
      .map((b, j) => ({ j, d: j === i ? Infinity : 1 - (a.dir[0] * b.dir[0] + a.dir[1] * b.dir[1] + a.dir[2] * b.dir[2]) }))
      .sort((p, q) => p.d - q.d)
      .slice(0, SKILLS_CLUSTER.links);
    near.forEach(({ j }) => {
      const key = i < j ? `${i}-${j}` : `${j}-${i}`;
      if (seen.has(key)) return;
      seen.add(key);
      links.push(i < j ? [i, j] : [j, i]);
    });
  });
  return { stars, links };
}

/** What the DOM shares with the scene each frame — refs, never React state, so the frame loop never re-renders. */
export type ClusterUI = {
  hovered: number | null;
  paused: boolean;
  /** Pointer in [-1, 1] over the cluster box (0,0 when away). */
  pointer: { x: number; y: number };
  /** Set once the section has first come into view: starts the assembly. */
  seenAt: number | null;
  /** px/s, from the page scroll. */
  velocity: () => number;
};
