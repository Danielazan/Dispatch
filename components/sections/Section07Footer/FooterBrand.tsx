import { Facebook, Instagram, Youtube, Linkedin } from "./socialIcons";
import type { LucideIcon } from "lucide-react";
import { footerBrand, footerSocial, type SocialIconKey } from "./footerData";

const SOCIAL_ICONS: Record<SocialIconKey, LucideIcon> = {
  facebook: Facebook,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
};

export default function FooterBrand() {
  return (
    <div data-s7="brand">
      {/* Wordmark — swap for the real logo asset here if/when one exists (§18). */}
      <a href="/" aria-label="Ironhaul Dispatch — home" className="inline-block">
        <span data-s7="brand-mark" className="block">
          <span className="block font-display text-[30px] font-semibold leading-none tracking-[0.02em] text-[var(--s7-soft-white)]">
            IRONHAUL
          </span>
        </span>
        <span data-s7="brand-accent" className="mt-2.5 flex items-center gap-2.5">
          <span aria-hidden="true" className="h-px w-7 bg-[var(--s7-brass)]" />
          <span className="font-tech text-[10px] font-medium tracking-[0.38em] text-[var(--s7-brass)]">
            DISPATCH
          </span>
        </span>
      </a>

      <p className="mt-5 max-w-[30ch] text-[13px] leading-relaxed text-[var(--s7-muted-text)]">
        {footerBrand.description}
      </p>

      <ul aria-label="Social media" className="mt-6 flex items-center gap-2.5">
        {footerSocial.map((social) => {
          const Icon = SOCIAL_ICONS[social.icon];
          return (
            <li key={social.label}>
              <a
                href={social.href /* TODO: production URL */}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={social.label}
                className="s7-social grid h-9 w-9 place-items-center rounded-[2px] border border-[var(--s7-border)] text-[var(--s7-muted-text)]"
              >
                <Icon className="h-4 w-4" strokeWidth={1.5} aria-hidden="true" />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}