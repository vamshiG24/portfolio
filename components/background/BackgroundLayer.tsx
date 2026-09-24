"use client";

import { VideoStage } from "./stage/VideoStage";

/** Fixed, full-viewport, z-0, pointer-events-none: the stage every section sits on. */
export function BackgroundLayer() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <VideoStage />
    </div>
  );
}
