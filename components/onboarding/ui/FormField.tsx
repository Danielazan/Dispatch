/* ============ FormField v3 - accepts string | number ============ */
'use client';
import { forwardRef } from 'react';

interface FormFieldProps {
  label: string;
  required?: boolean;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  type?: string;
  step?: string;
  error?: string;
}

export const FormField = forwardRef<HTMLInputElement, FormFieldProps>(
  ({ label, required, value, onChange, placeholder, type = 'text', step, error }, ref) => {
    // Convert null/undefined to empty string for the input value
    const inputValue = value === null || value === undefined ? '' : String(value);

    return (
      <div className="mb-4">
        <label className="block text-[13px] text-steel-300 mb-1.5">
          {label}
          {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        <input
          ref={ref}
          type={type}
          step={step}
          value={inputValue}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full h-10 px-3 rounded-[6px] bg-ink-900 border border-steel-700/40 text-[13px] text-ivory-50 placeholder:text-steel-600 focus:outline-none focus:border-brass-500/70 transition-colors"
          style={{ pointerEvents: 'auto' }}
        />
        {error && <p className="mt-1 text-[11px] text-red-400">{error}</p>}
      </div>
    );
  }
);

FormField.displayName = 'FormField';
