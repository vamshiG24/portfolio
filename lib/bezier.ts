/** Pure cubic-bezier sampling in normalised space. No deps, no DOM. */

export type Pt = { x: number; y: number };

/** Point on the cubic P0→P1→P2→P3 at t∈[0,1]. */
export function cubicPoint(t: number, p0: Pt, p1: Pt, p2: Pt, p3: Pt): Pt {
  const u = 1 - t;
  const a = u * u * u;
  const b = 3 * u * u * t;
  const c = 3 * u * t * t;
  const d = t * t * t;
  return {
    x: a * p0.x + b * p1.x + c * p2.x + d * p3.x,
    y: a * p0.y + b * p1.y + c * p2.y + d * p3.y,
  };
}

/**
 * The site's arc: (1,1) bottom-right → (0,0) top-left.
 * `bend` slides the control points between the straight diagonal (0) and the
 * strong arc P1 (1, 0.25), P2 (0.35, 0) (1).
 */
export function arcControls(bend: number): [Pt, Pt, Pt, Pt] {
  const b = Math.min(1, Math.max(0, bend));
  // Straight-line controls sit on the diagonal at 2/3 and 1/3.
  const p1: Pt = { x: 2 / 3 + (1 - 2 / 3) * b, y: 2 / 3 + (0.25 - 2 / 3) * b };
  const p2: Pt = { x: 1 / 3 + (0.35 - 1 / 3) * b, y: 1 / 3 + (0 - 1 / 3) * b };
  return [{ x: 1, y: 1 }, p1, p2, { x: 0, y: 0 }];
}
