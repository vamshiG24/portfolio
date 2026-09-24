"use client";

import { useRef, type ReactNode } from "react";
import { LogSidebar } from "./LogSidebar";

type Props = {
  projectTitle: string;
  projectSlug: string;
  entries: { slug: string; title: string; date: string }[];
  children: ReactNode;
};

/** Sticky sidebar + article column. Owns the ref the sidebar's rail reads. */
export function LogLayout({ projectTitle, projectSlug, entries, children }: Props) {
  const articleRef = useRef<HTMLDivElement>(null);
  return (
    <div className="container-page grid gap-12 pt-32 pb-24 lg:grid-cols-[18rem_1fr] lg:gap-20">
      <LogSidebar projectTitle={projectTitle} projectSlug={projectSlug} entries={entries} articleRef={articleRef} />
      <div ref={articleRef} className="min-w-0 max-w-(--measure)">
        {children}
      </div>
    </div>
  );
}
