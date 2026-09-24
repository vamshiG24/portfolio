import Link from "next/link";
import { getLogs, getProjects } from "@/lib/content";
import { BreakpointList, type BreakpointItem } from "./BreakpointList";
import { Section } from "./Section";

/**
 * Home-page "Breakpoints": the places a build broke and what got it moving
 * again. One card per log entry whose frontmatter records a `challenge` and a
 * `solution`, newest first, each linking into its full /projects/[slug]/log
 * entry. Server component — reads MDX.
 */
export async function Breakpoints() {
  const projects = await getProjects();
  const items: BreakpointItem[] = (
    await Promise.all(
      projects.map(async (p) => (await getLogs(p.slug)).map((l) => ({ ...l, projectTitle: p.title }))),
    )
  )
    .flat()
    .filter((l) => l.challenge && l.solution)
    .sort((a, b) => b.date.localeCompare(a.date))
    .map((l) => ({
      slug: l.slug,
      project: l.project,
      projectTitle: l.projectTitle,
      date: l.date,
      title: l.title,
      tags: l.tags,
      challenge: l.challenge!,
      solution: l.solution!,
    }));

  return (
    <Section id="breakpoints" eyebrow="05 — Breakpoints" title="Where it broke, and how I fixed it">
      <p className="max-w-(--measure) text-fg-muted">
        Every build hits a wall somewhere. These are the ones worth writing down: the problem as it showed up, and the change that got
        it moving again.
      </p>
      <BreakpointList items={items} />
      <div className="mt-12 flex flex-wrap items-center gap-3">
        <p className="eyebrow mr-2">Full build logs</p>
        <ul className="flex flex-wrap gap-3" aria-label="Full build logs">
          {projects.map((p) => (
            <li key={p.slug} className="chip rounded-full border border-line-strong text-sm text-fg">
              <Link href={`/projects/${p.slug}/log`} className="block px-4 py-2">
                {p.title} →
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}
