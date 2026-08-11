"use client";

import { useEffect, useState } from "react";
import { NAV_LINKS, siteConfig } from "@/config/site";
import CtaLink from "@/components/landing/CtaLink";

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open
          ? "border-b border-white/10 bg-ink-950/95"
          : "border-b border-transparent bg-gradient-to-b from-ink-950/85 to-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-16 max-w-[1440px] items-center justify-between px-6 lg:h-[72px] lg:px-10">
        {/* Brand */}
        <a href="#top" className="flex items-baseline gap-2">
          <span className="font-display text-[19px] font-semibold tracking-[0.08em] text-ivory-50">
            {siteConfig.brand}
          </span>
          <span className="font-tech text-[10px] tracking-[0.3em] text-brass-400">
            {siteConfig.descriptor}
          </span>
        </a>

        {/* Desktop links */}
        <ul className="hidden items-center gap-7 lg:flex">
          {NAV_LINKS.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-[11px] font-medium tracking-[0.14em] text-steel-300 transition-colors duration-200 hover:text-brass-300"
              >
                {link.label}
                {link.external && <span aria-hidden="true" className="ml-1 text-[9px] align-top">↗</span>}
              </a>
            </li>
          ))}
        </ul>

        {/* Right cluster */}
        <div className="hidden items-center gap-6 lg:flex">
          <div className="hidden flex-col items-end xl:flex">
            <a href={siteConfig.phoneHref} className="font-tech text-[12px] text-ivory-100 hover:text-brass-300 transition-colors">
              {siteConfig.phone}
            </a>
            <span className="font-tech text-[10px] tracking-[0.08em] text-steel-500">{siteConfig.hours}</span>
          </div>
          <CtaLink href="#lead-form" variant="solid" size="sm" withArrow>
            GET DISPATCHED
          </CtaLink>
        </div>

        {/* Mobile toggle */}
        <button
          type="button"
          aria-label={open ? "Close menu" : "Open menu"}
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((v) => !v)}
          className="grid h-10 w-10 place-items-center border border-white/10 rounded-[2px] text-ivory-100 lg:hidden"
        >
          <svg viewBox="0 0 20 20" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            {open ? <path d="M4 4l12 12M16 4L4 16" /> : <path d="M2.5 5.5h15M2.5 10h15M2.5 14.5h15" />}
          </svg>
        </button>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div id="mobile-menu" className="border-t border-white/10 bg-ink-950/[0.98] px-6 pb-8 pt-2 lg:hidden">
          <ul className="divide-y divide-white/5">
            {NAV_LINKS.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="block py-3.5 text-[12px] tracking-[0.18em] text-ivory-100 hover:text-brass-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="mt-5 flex flex-col gap-1 border-t border-white/10 pt-5">
            <a href={siteConfig.phoneHref} className="font-tech text-[13px] text-ivory-100">
              {siteConfig.phone}
            </a>
            <span className="font-tech text-[11px] text-steel-500">{siteConfig.hours}</span>
          </div>
          <div className="mt-6">
            <CtaLink href="#lead-form" variant="solid" withArrow>
              GET DISPATCHED
            </CtaLink>
          </div>
        </div>
      )}
    </header>
  );
}