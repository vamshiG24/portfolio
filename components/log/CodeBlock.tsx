import { isValidElement, type ReactNode } from "react";
import { codeToHtml } from "shiki";
import { CopyButton } from "./CopyButton";

type CodeProps = { className?: string; children?: ReactNode };

/**
 * MDX `pre` replacement. Server component: highlights with shiki at build /
 * request time (dual theme via CSS vars, see globals.css), then adds a copy
 * button. No highlighter JS ships to the client.
 */
export async function CodeBlock({ children }: { children?: ReactNode }) {
  const code = isValidElement<CodeProps>(children) ? children : null;
  const raw = typeof code?.props.children === "string" ? code.props.children : String(code?.props.children ?? "");
  const lang = code?.props.className?.replace(/^language-/, "") || "text";
  const source = raw.replace(/\n$/, "");

  const html = await codeToHtml(source, {
    lang,
    themes: { light: "github-light", dark: "github-dark-dimmed" },
    defaultColor: false,
  });

  return (
    <figure className="code-block group relative my-6 overflow-hidden rounded-lg border border-line bg-bg-elev">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2 text-xs text-fg-muted">
        <span className="font-mono">{lang}</span>
        <CopyButton code={source} />
      </figcaption>
      <div className="overflow-x-auto text-sm leading-relaxed [&_pre]:p-4" dangerouslySetInnerHTML={{ __html: html }} />
    </figure>
  );
}
