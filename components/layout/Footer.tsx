import { site } from "@/content/site";

export function Footer() {
  return (
    <footer className="relative z-10 border-t border-line bg-bg">
      <div className="container-page flex flex-col gap-4 py-10 text-sm text-fg-subtle sm:flex-row sm:items-center sm:justify-between">
        <p>
          © {new Date().getFullYear()} {site.name} · Bengaluru
        </p>
        <ul className="flex gap-5">
          {site.socials.map((s) => (
            <li key={s.label}>
              <a
                href={s.href}
                target="_blank"
                rel="noreferrer noopener"
                className="hue-text hue-line"
              >
                {s.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
