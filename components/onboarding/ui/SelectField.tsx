'use client';
import { forwardRef, type SelectHTMLAttributes } from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  required?: boolean;
  error?: string;
  options: { value: string; label: string }[];
  placeholder?: string;
}

/* Same bulletproof grammar as FormField: block label, full-width control */
export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, required, error, options, placeholder, className, ...props }, ref) => (
    <div>
      <label style={{ display: 'block', marginBottom: 6 }} className="text-[12px] leading-snug text-steel-300">
        {label}
        {required && <span className="text-red-400 ml-1">*</span>}
      </label>
      <div className="relative">
        <select
          ref={ref}
          style={{ display: 'block', width: '100%', minWidth: 0, boxSizing: 'border-box', appearance: 'none' }}
          className={`h-10 bg-ink-900 border border-steel-700/30 rounded-[6px] px-3.5 pr-9 text-[13px] text-ivory-50 focus:outline-none focus:border-brass-500/70 focus:bg-ink-850 transition-colors duration-200 ${error ? 'border-red-500/50' : ''} ${className ?? ''}`}
          {...props}
        >
          {placeholder && <option value="" disabled>{placeholder}</option>}
          {options.map((o) => (
            <option key={o.value} value={o.value} className="bg-ink-900 text-ivory-50">{o.label}</option>
          ))}
        </select>
        <ChevronDown size={14} className="text-steel-400 pointer-events-none absolute right-3 top-1/2 -translate-y-1/2" />
      </div>
      {error && <p style={{ marginTop: 4 }} className="text-[11px] text-red-400">{error}</p>}
    </div>
  )
);
SelectField.displayName = 'SelectField';