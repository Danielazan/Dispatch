/* ============ DispatchField v2 ============ */
'use client';

import { useId } from 'react';
import type { FieldConfig } from './dispatchData';
import { isFieldValueValid } from './dispatchData';

interface DispatchFieldProps {
  config: FieldConfig;
  value: string;
  touched: boolean;
  required: boolean;
  placeholder?: string;
  className?: string;
  onChange: (key: string, value: string) => void;
  onBlur: (key: string) => void;
  /** Server-reported error message for this field (from backend details[].path). */
  serverError?: string;
}

export default function DispatchField({
  config,
  value,
  touched,
  required,
  placeholder,
  className = '',
  onChange,
  onBlur,
  serverError,
}: DispatchFieldProps) {
  const id = useId();
  const isValid = isFieldValueValid(config, value, required);
  const hasClientError = touched && !isValid && required;
  const showError = hasClientError || !!serverError;
  const errorMessage = serverError || (hasClientError ? 'Required' : null);

  const inputClasses = `w-full rounded-[2px] border bg-[var(--s6-raised)] px-3 py-2.5 text-[13px] text-[var(--s6-warm-white)] placeholder:text-[var(--s6-muted-text)]/60 transition-colors duration-200 focus:border-[var(--s6-brass)] focus:outline-none ${
    showError ? 'border-[var(--s6-error)]' : 'border-[var(--s6-border)]'
  }`;

  return (
    <div data-s6-group={config.group} className={`relative ${className}`}>
      <label
        htmlFor={id}
        className="mb-1.5 flex items-baseline gap-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--s6-muted-text)]"
      >
        {config.label}
        {config.optional && (
          <span className="font-tech text-[8.5px] tracking-[0.14em] text-[var(--s6-muted-text)]/60">OPTIONAL</span>
        )}
      </label>

      {config.type === 'select' ? (
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(config.key, e.target.value)}
          onBlur={() => onBlur(config.key)}
          className={`s6-select ${inputClasses} ${!value ? 'text-[var(--s6-muted-text)]/60' : ''}`}
          aria-invalid={showError}
        >
          <option value="" disabled>
            Select...
          </option>
          {config.options?.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          type={config.type}
          value={value}
          placeholder={placeholder ?? config.placeholder}
          onChange={(e) => onChange(config.key, e.target.value)}
          onBlur={() => onBlur(config.key)}
          className={inputClasses}
          aria-invalid={showError}
        />
      )}

      <span
        aria-hidden="true"
        className={`s6-accept-line absolute bottom-0 left-0 h-[1.5px] w-full ${isValid && value && !showError ? 'valid' : ''}`}
      />

      {errorMessage && (
        <p className="mt-1 text-[10px] text-[var(--s6-error)]" role="alert">
          {errorMessage}
        </p>
      )}
    </div>
  );
}