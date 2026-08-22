'use client';
import { forwardRef, type InputHTMLAttributes } from 'react';

interface FormFieldProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  required?: boolean;
  error?: string;
}

/* Bulletproof: block label + block input at 100% width. No flex, no grid —
   the input can never collapse regardless of parent constraints. */
export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, required, error, className, ...props }, ref) => (
    <div>
      <label style={{ display: 'block', marginBottom: 6 }} className="text-[12px] leading-snug text-steel-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <input
        ref={ref}
        style={{ display: 'block', width: '100%', minWidth: 0, boxSizing: 'border-box' }}
        className={`h-10 bg-ink-900 border border-steel-700/30 rounded-[6px] px-3.5 text-[13px] text-ivory-50 placeholder:text-steel-600 focus:outline-none focus:border-brass-500/70 focus:bg-ink-850 transition-colors duration-200 ${
          error ? 'border-red-500/50' : ''
        } ${className ?? ''}`}
        {...props}
      />
      {error && <p style={{ marginTop: 4 }} className="text-[11px] text-red-400">{error}</p>}
    </div>
  )
);
FormField.displayName = 'FormField';