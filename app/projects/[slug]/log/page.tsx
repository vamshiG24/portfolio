import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { compileMDX } from "next-mdx-remote/rsc";
import { CodeBlock } from "@/components/log/CodeBlock";
import { LogEntry } from "@/components/log/LogEntry";
import { LogLayout } from "@/components/log/LogLayout";
import { getLogs, getProject, getProjectSlugs } from "@/lib/content";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getProjectSlugs()).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProject(slug);
  return { title: project ? `${project.title} — build log` : "Build log" };
}

const mdxComponents = { pre: CodeBlock };

export default async function LogPage({ params }: Params) {
  const { slug } = await params;
  const project = await getProject(slug);
  if (!project) notFound();
  const logs = await getLogs(slug);

  const compiled = await Promise.all(
    logs.map(async (log) => ({
      log,
      content: (await compileMDX({ source: log.body, components: mdxComponents })).content,
    })),
  );

  return (
    <LogLayout
      projectTitle={project.title}
      projectSlug={project.slug}
      entries={logs.map((l) => ({ slug: l.slug, title: l.title, date: l.date }))}
    >
      {compiled.length === 0 && <p className="text-fg-muted">No entries yet.</p>}
      {compiled.map(({ log, content }) => (
        <LogEntry key={log.slug} id={log.slug} date={log.date} title={log.title} tags={log.tags}>
          {content}
        </LogEntry>
      ))}
    </LogLayout>
  );
}
