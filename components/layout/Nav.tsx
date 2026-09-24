"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useState } from "react";
import { site } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { cn } from "@/lib/utils";
import { BrandMark } from "./BrandMark";

const ids = site.nav.map((n) => n.id);

/**
 * Spec-1 top bar: brand mark left, plain centred links, white pill right.
 * Below the landscape breakpoint the links collapse into a frosted burger
 * that opens a full-screen menu with a staggered reveal.
 */
export function Nav() {
  const pathname = usePathname();
  const onHome = pathname === "/";
  const sectionActive = useActiveSection(ids);
  const active = onHome ? sectionActive : null;
  const hrefFor = (id: string) => (onHome ? `#${id}` : `/#${id}`);
  const [open, setOpen] = useState(false);
  const menuId = useId();

  // Close on Escape and when the viewport turns landscape.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => {
      if (window.innerWidth / window.innerHeight > 1.1) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    document.documentElement.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  return (
    <header className={cn("topbar fixed inset-x-0 top-0 z-40", open && "is-open")}>
      <a
        href="#main"
        className="sr-only-keep focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-accent focus:px-3 focus:py-2 focus:text-accent-fg"
      >
        Skip to content
      </a>

      <div className="topbar-inner">
        <Link href="/" className="brand" aria-label={`${site.name} — home`}>
          <BrandMark className="brand-mark" />
        </Link>

        <nav aria-label="Primary" className="links">
          {site.nav.map((item) => (
            <a
              key={item.id}
              href={hrefFor(item.id)}
              aria-current={active === item.id ? "true" : undefined}
              className={cn("link hue-text hue-line", active === item.id && "is-active")}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a href={hrefFor("contact")} className="pill pill-nav">
          <span>Get in touch</span>
        </a>

        <button
          type="button"
          className="burger"
          aria-expanded={open}
          aria-controls={menuId}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((o) => !o)}
        >
          <i />
          <i />
        </button>
      </div>

      {/* full-screen menu (portrait) */}
      <nav id={menuId} className="menu" aria-label="Primary" aria-hidden={!open}>
        <div className="menu-inner">
          <p className="menu-eyebrow eyebrow">Menu</p>
          <ul className="menu-list">
            {site.nav.map((item, i) => (
              <li key={item.id} style={{ transitionDelay: `${0.1 + i * 0.06}s` }}>
                <a href={hrefFor(item.id)} onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
                  <span className="hue-text inline-block">{item.label}</span>
                </a>
              </li>
            ))}
          </ul>
          <div className="menu-foot" style={{ transitionDelay: `${0.1 + site.nav.length * 0.06}s` }}>
            <a href={hrefFor("contact")} className="pill" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              <span>Get in touch</span>
            </a>
            <a href={hrefFor("projects")} className="ghost" onClick={() => setOpen(false)} tabIndex={open ? 0 : -1}>
              View work
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
}
