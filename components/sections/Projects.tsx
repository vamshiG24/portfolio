import { getProjects } from "@/lib/content";
import { ProjectsClient } from "./ProjectsClient";

/** Server wrapper: reads content/projects/*.mdx, hands plain data to the client section. */
export async function Projects() {
  const projects = await getProjects();
  return (
    <ProjectsClient
      projects={projects.map(({ body, ...p }) => ({ ...p, excerpt: body.split("\n\n")[0] }))}
    />
  );
}
