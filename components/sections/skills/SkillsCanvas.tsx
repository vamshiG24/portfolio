"use client";

import { Canvas } from "@react-three/fiber";
import type { RefObject } from "react";
import { SKILLS_CLUSTER as C } from "@/config/motion";
import { ClusterScene } from "./ClusterScene";
import type { ClusterUI } from "./cluster";

type Props = {
  ui: RefObject<ClusterUI>;
  labels: RefObject<(HTMLElement | null)[]>;
  reduced: boolean;
  /** Render only while the cluster is on screen. */
  active: boolean;
};

/** The one <Canvas> for the skills constellation: transparent, over the stage's glow. Loaded on demand. */
export default function SkillsCanvas({ ui, labels, reduced, active }: Props) {
  return (
    <Canvas
      frameloop={active ? "always" : "never"}
      dpr={[1, 1.5]}
      camera={{ fov: C.camera.fov, near: 0.1, far: 40, position: [0, 0, C.camera.z] }}
      gl={{ antialias: true, alpha: true, stencil: false, powerPreference: "high-performance" }}
      style={{ position: "absolute", inset: 0 }}
      aria-hidden
    >
      <ClusterScene ui={ui} labels={labels} reduced={reduced} />
    </Canvas>
  );
}
