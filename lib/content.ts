import "server-only";
import fs from "node:fs/promises";
import path from "node:path";
import matter from "gray-matter";

const ROOT = path.join(process.cwd(), "content");

export type ProjectFrontmatter = {
  title: string;
  slug: string;
  blurb: string;
  stack: string[];
  role: string;
  period: string;
  repo?: string;
  demo?: string;
  cover?: string;
  featured?: boolean;
};

export type Project = ProjectFrontmatter & { body: string };

export type LogFrontmatter = {
  date: string; // ISO yyyy-mm-dd
  title: string;
  tags: string[];
  /** Optional: an entry that records a wall hit and what got past it shows up in the home page's Breakpoints. */
  challenge?: string;
  solution?: string;
};

export type LogEntry = LogFrontmatter & {
  slug: string; // filename without extension
  project: string; // project slug
  body: string;
};

async function readMdxDir(dir: string): Promise<{ file: string; raw: string }[]> {
  let names: string[] = [];
  try {
    names = await fs.readdir(dir);
  } catch {
    return [];
  }
  const files = names.filter((n) => n.endsWith(".mdx") || n.endsWith(".md"));
  return Promise.all(
    files.map(async (file) => ({ file, raw: await fs.readFile(path.join(dir, file), "utf8") })),
  );
}

export async function getProjects(): Promise<Project[]> {
  const files = await readMdxDir(path.join(ROOT, "projects"));
  const projects = files.map(({ raw }) => {
    const { data, content } = matter(raw);
    return { ...(data as ProjectFrontmatter), body: content.trim() };
  });
  // Featured first, then by period string desc (good enough for placeholders; TODO refine).
  return projects.sort((a, b) => Number(!!b.featured) - Number(!!a.featured) || b.period.localeCompare(a.period));
}

export async function getProject(slug: string): Promise<Project | null> {
  const all = await getProjects();
  return all.find((p) => p.slug === slug) ?? null;
}

/** Newest first. */
export async function getLogs(projectSlug: string): Promise<LogEntry[]> {
  const files = await readMdxDir(path.join(ROOT, "logs", projectSlug));
  return files
    .map(({ file, raw }) => {
      const { data, content } = matter(raw);
      return {
        ...(data as LogFrontmatter),
        slug: file.replace(/\.mdx?$/, ""),
        project: projectSlug,
        body: content.trim(),
      };
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export async function getProjectSlugs(): Promise<string[]> {
  return (await getProjects()).map((p) => p.slug);
}
