import { footerNavigation } from "./footerData";

/* Data-driven navigation (§23). Each GROUP animates — never individual links (§36). */
export default function FooterNavigation() {
  return (
    <>
      {Object.values(footerNavigation).map((group) => (
        <nav key={group.title} data-s7="nav-group" aria-label={group.ariaLabel}>
          <h2 className="font-tech text-[10px] font-medium tracking-[0.22em] text-[rgba(233,228,218,0.82)]">
            {group.title}
          </h2>
          <span aria-hidden="true" className="mt-2.5 block h-px w-6 bg-[var(--s7-border-brass)]" />
          <ul className="mt-4 grid grid-cols-2 gap-x-6 gap-y-2.5 lg:grid-cols-1">
            {group.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="s7-link inline-block py-0.5 text-[13px] leading-snug text-[var(--s7-muted-text)]"
                >
                  {link.label}
                  <span aria-hidden="true" className="s7-link-rule" />
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ))}
    </>
  );
}