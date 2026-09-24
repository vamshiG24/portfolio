import type { ReactNode } from "react";

type Props = {
  id: string;
  eyebrow?: string;
  title: string;
  children?: ReactNode;
  className?: string;
};

/**
 * Semantic section shell used by every page section. Heading levels: the hero
 * owns the h1; everything else is an h2.
 */
export function Section({ id, eyebrow, title, children, className = "" }: Props) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-title`}
      className={`relative z-10 scroll-mt-24 py-(--space-24) md:py-(--space-32) ${className}`}
    >
      <div className="container-page">
        <div className="rule pt-6 md:grid md:grid-cols-[14rem_1fr] md:gap-12">
          {eyebrow && <p className="eyebrow mb-3 md:mb-0">{eyebrow}</p>}
          <h2 id={`${id}-title`} className="text-3xl">
            {title}
          </h2>
        </div>
        <div className="mt-14 md:mt-20">{children}</div>
      </div>
    </section>
  );
}
