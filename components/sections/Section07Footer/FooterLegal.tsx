/* ============ FooterLegal v2 ============ */
import Link from "next/link";
import SectionContainer from "@/components/landing/SectionContainer";
import { footerLegalLinks } from "./footerData";

export default function FooterLegal() {
  const year = new Date().getFullYear();

  return (
    <div data-s7="legal" className="relative z-10 border-t border-[var(--s7-border)]">
      <SectionContainer className="flex flex-col gap-2.5 py-5 md:flex-row md:items-center md:justify-between md:gap-4">
        <p className="text-[11px] tracking-[0.04em] text-[rgba(138,145,143,0.75)]">
          © {year} Ironhaul Dispatch, LLC. All rights reserved.
        </p>
        <ul className="flex items-center gap-6">
          {footerLegalLinks.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                className="s7-link inline-block pb-0.5 text-[11px] text-[rgba(138,145,143,0.75)]"
              >
                {link.label}
                <span aria-hidden="true" className="s7-link-rule" />
              </Link>
            </li>
          ))}
        </ul>
      </SectionContainer>
    </div>
  );
}
