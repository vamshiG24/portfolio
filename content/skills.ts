export type Skill = {
  name: string;
  /** Groups drive colour on the sphere and the legend. */
  group: "languages" | "web" | "backend" | "ai" | "devops";
  /** 1–3: pill size + weight on the sphere. */
  weight: 1 | 2 | 3;
};

/** From content/site.tex — Technical Skills. ~24–36 entries reads best on the sphere. */
export const skills: Skill[] = [
  // Languages
  { name: "Python", group: "languages", weight: 3 },
  { name: "JavaScript", group: "languages", weight: 3 },
  { name: "C++", group: "languages", weight: 2 },
  // Web
  { name: "React", group: "web", weight: 3 },
  { name: "Node.js", group: "web", weight: 3 },
  { name: "Express", group: "web", weight: 2 },
  { name: "FastAPI", group: "web", weight: 2 },
  { name: "MongoDB", group: "web", weight: 2 },
  { name: "Supabase / PostgreSQL", group: "web", weight: 2 },
  { name: "Tailwind CSS", group: "web", weight: 1 },
  { name: "Vite", group: "web", weight: 1 },
  // Backend & architecture
  { name: "REST APIs", group: "backend", weight: 2 },
  { name: "Microservices", group: "backend", weight: 3 },
  { name: "WebSockets", group: "backend", weight: 1 },
  { name: "JWT", group: "backend", weight: 1 },
  { name: "2FA", group: "backend", weight: 1 },
  { name: "RBAC / ABAC", group: "backend", weight: 2 },
  // AI & ML
  { name: "Gemini API", group: "ai", weight: 2 },
  { name: "RAG", group: "ai", weight: 3 },
  { name: "LangGraph", group: "ai", weight: 2 },
  { name: "Qdrant", group: "ai", weight: 2 },
  { name: "Prompt engineering", group: "ai", weight: 1 },
  { name: "TensorFlow", group: "ai", weight: 1 },
  { name: "Keras", group: "ai", weight: 1 },
  // DevOps & tools
  { name: "Docker", group: "devops", weight: 3 },
  { name: "Nginx", group: "devops", weight: 2 },
  { name: "Redis", group: "devops", weight: 2 },
  { name: "Git", group: "devops", weight: 1 },
  { name: "GitHub Actions", group: "devops", weight: 1 },
  { name: "n8n", group: "devops", weight: 2 },
];
