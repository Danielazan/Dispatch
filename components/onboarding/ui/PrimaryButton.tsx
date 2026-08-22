'use client';
import { ButtonHTMLAttributes, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ArrowRight } from 'lucide-react';

interface PrimaryButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading?: boolean;
}

export function PrimaryButton({ children, loading, className, ...props }: PrimaryButtonProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const arrowRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!btnRef.current || !arrowRef.current) return;
    const btn = btnRef.current;
    const arrow = arrowRef.current;

    const handleEnter = () => gsap.to(arrow, { x: 4, duration: 0.3, ease: 'power2.out' });
    const handleLeave = () => gsap.to(arrow, { x: 0, duration: 0.3, ease: 'power2.out' });

    btn.addEventListener('mouseenter', handleEnter);
    btn.addEventListener('mouseleave', handleLeave);
    return () => {
      btn.removeEventListener('mouseenter', handleEnter);
      btn.removeEventListener('mouseleave', handleLeave);
    };
  }, []);

  return (
    <button
      ref={btnRef}
      className={`relative flex items-center justify-center gap-3 px-8 py-4 rounded-[7px] bg-brass-500 text-ink-950 font-display font-semibold uppercase tracking-wider text-sm shadow-[0_16px_36px_rgba(0,0,0,0.18)] disabled:opacity-50 disabled:cursor-not-allowed ${className || ''}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading ? <span className="font-tech text-xs tracking-widest">TRANSMITTING...</span> : (
        <>
          <span>{children}</span>
          <ArrowRight ref={arrowRef} size={18} strokeWidth={2.5} />
        </>
      )}
    </button>
  );
}