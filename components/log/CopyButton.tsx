"use client";

import { useState } from "react";

export function CopyButton({ code }: { code: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 1600);
  };
  return (
    <button
      type="button"
      onClick={copy}
      aria-live="polite"
      className="rounded-md border border-line px-2 py-1 text-xs text-fg-muted transition-[color,border-color,background-color] duration-(--dur-hover) ease-(--ease-out) hover:border-hue-teal/60 hover:bg-hue-teal/10 hover:text-hue-teal"
    >
      {state === "copied" ? "Copied" : state === "failed" ? "Copy failed" : "Copy"}
    </button>
  );
}
