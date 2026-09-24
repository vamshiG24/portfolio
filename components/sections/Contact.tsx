import { MagneticButton } from "@/components/ui/magnetic-button";
import { site } from "@/content/site";
import { ContactForm } from "./ContactForm";
import { Section } from "./Section";

export function Contact() {
  return (
    <Section id="contact" eyebrow="06 — Contact" title="Let's build something">
      <div className="grid gap-12 lg:grid-cols-[1fr_1.2fr] lg:gap-20">
        <div>
          <p className="max-w-(--measure) text-lg text-fg-muted">
            Open to internships and full-time roles — backend, AI systems, full-stack. Based in Bengaluru,
            happy to work remote. Fastest way is email; the form works too.
          </p>
          <div className="mt-10">
            <MagneticButton href={`mailto:${site.email}`}>
              <span>{site.email}</span>
              <span aria-hidden className="transition-transform duration-(--dur-hover) ease-(--ease-out) group-hover/magnet:translate-x-1">→</span>
            </MagneticButton>
          </div>
          <ul className="mt-10 flex flex-wrap gap-x-6 gap-y-2 text-sm text-fg-muted">
            {site.socials.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noreferrer noopener" className="hue-text hue-line">
                  {s.label} ↗
                </a>
              </li>
            ))}
          </ul>
        </div>
        <ContactForm />
      </div>
    </Section>
  );
}
