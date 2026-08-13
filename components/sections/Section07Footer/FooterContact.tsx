import { Phone, Mail, MapPin, Clock } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { footerContact } from "./footerData";

interface ContactItem {
  key: string;
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
}

export default function FooterContact() {
  const items: ContactItem[] = [
    { key: "phone", icon: Phone, label: "PHONE", value: footerContact.phoneLabel, href: footerContact.phoneHref },
    { key: "email", icon: Mail, label: "EMAIL", value: footerContact.email, href: footerContact.emailHref },
    // TODO: add a map href only if the project supplies a destination (§27).
    { key: "location", icon: MapPin, label: "LOCATION", value: footerContact.location },
    { key: "hours", icon: Clock, label: "HOURS", value: footerContact.hours },
  ];

  return (
    <div data-s7="contact">
      <h2 className="font-tech text-[10px] font-medium tracking-[0.22em] text-[rgba(233,228,218,0.82)]">
        CONTACT
      </h2>
      <span aria-hidden="true" className="mt-2.5 block h-px w-6 bg-[var(--s7-border-brass)]" />

      <ul className="mt-4 space-y-3">
        {items.map(({ key, icon: Icon, label, value, href }) => {
          const inner = (
            <>
              <span className="s7-contact-icon grid h-8 w-8 shrink-0 place-items-center rounded-[2px] border border-[var(--s7-border)]">
                <Icon className="h-3.5 w-3.5" strokeWidth={1.5} aria-hidden="true" />
              </span>
              <span className="s7-contact-text min-w-0">
                <span className="block font-tech text-[8.5px] tracking-[0.18em] text-[rgba(138,145,143,0.7)]">
                  {label}
                </span>
                <span className="mt-0.5 block text-[13px] leading-snug text-[rgba(233,228,218,0.9)]">
                  {value}
                </span>
              </span>
            </>
          );
          return (
            <li key={key}>
              {href ? (
                <a href={href} className="s7-contact-item flex items-center gap-3">
                  {inner}
                </a>
              ) : (
                <div className="s7-contact-item flex items-center gap-3">{inner}</div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}