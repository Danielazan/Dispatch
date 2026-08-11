import type { ReactNode } from "react";

/* Shared outer container — keeps every section aligned to the 1440px system. */
export default function SectionContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`mx-auto w-full max-w-[1440px] px-[clamp(24px,4vw,64px)] ${className}`}>
      {children}
    </div>
  );
}