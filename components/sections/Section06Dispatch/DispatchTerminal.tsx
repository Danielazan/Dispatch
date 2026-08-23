/* ============ DispatchTerminal v2 ============ */
'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import DispatchField from './DispatchField';
import {
  initialFormData,
  FIELD_CONFIGS,
  getRequiredCount,
  getValidCount,
  isFieldRequired,
  submitDispatchRequest,
  type DispatchFormData,
  type DispatchFormStatus,
  type SubmitResult,
} from './dispatchData';

interface DispatchTerminalProps {
  /** Fires on first focus/input — lets the cinematic layer snap the boot to completion. */
  onInteracted?: () => void;
}

/** Map backend error path → frontend field key for inline error display. */
const BACKEND_PATH_TO_FIELD: Record<string, string> = {
  contactName: 'fullName',
  email: 'email',
  phone: 'phone',
  authorityNumber: 'authorityNumber',
  consentAccepted: 'consent',
};

export default function DispatchTerminal({ onInteracted }: DispatchTerminalProps) {
  const [formData, setFormData] = useState<DispatchFormData>(initialFormData);
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [status, setStatus] = useState<DispatchFormStatus>('idle');
  const [shimmer, setShimmer] = useState(false);
  const shimmerPlayed = useRef(false);
  const [result, setResult] = useState<SubmitResult | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const validCount = getValidCount(formData);
  const requiredCount = getRequiredCount(formData);
  const isReady = validCount === requiredCount;
  const statusLabel = isReady ? 'READY TO DISPATCH' : 'STANDING BY';

  useEffect(() => {
    if (isReady && !shimmerPlayed.current) {
      shimmerPlayed.current = true;
      setShimmer(true);
      const t = setTimeout(() => setShimmer(false), 950);
      return () => clearTimeout(t);
    }
  }, [isReady]);

  const handleChange = useCallback(
    (key: string, value: string | boolean) => {
      setFormData((prev) => ({ ...prev, [key]: value }));
      /* Clear any server-reported error for this field the moment the user edits it */
      if (fieldErrors[key]) {
        setFieldErrors((prev) => {
          const next = { ...prev };
          delete next[key];
          return next;
        });
      }
      onInteracted?.();
    },
    [onInteracted, fieldErrors]
  );

  const handleBlur = useCallback((key: string) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const allTouched: Record<string, boolean> = {};
    FIELD_CONFIGS.forEach((f) => (allTouched[f.key] = true));
    allTouched.consent = true;
    setTouched(allTouched);
    if (!isReady) return;

    setStatus('submitting');
    setFieldErrors({});
    setResult(null);

    const r = await submitDispatchRequest(formData);
    setResult(r);

    if (r.success) {
      setStatus('success');
    } else if (r.kind === 'validation') {
      setStatus('error');
      const mapped: Record<string, string> = {};
      for (const [path, msg] of Object.entries(r.fieldErrors)) {
        const field = BACKEND_PATH_TO_FIELD[path] ?? path;
        mapped[field] = msg;
      }
      setFieldErrors(mapped);
    } else {
      setStatus('error');
    }
  };

  const resetToIdle = () => {
    setStatus('idle');
    setResult(null);
    setFieldErrors({});
  };

  /* ---- SUCCESS — dispatch handoff ---- */
  if (status === 'success') {
    const recipient = result?.success ? result.recipientEmail : formData.email;
    return (
      <div
        data-s6="terminal"
        aria-live="polite"
        className="relative rounded-[3px] border border-[var(--s6-border-brass)] bg-[var(--s6-graphite)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
      >
        <div className="mb-8 flex items-center justify-between border-b border-[var(--s6-border)] pb-4">
          <span className="font-tech text-[10px] tracking-[0.18em] text-[var(--s6-muted-text)]">DISPATCH INTAKE</span>
          <span className="flex items-center gap-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s6-success)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--s6-success)]" />
            CONFIRMED
          </span>
        </div>
        <div className="flex flex-col items-center py-8 text-center">
          <span className="mb-4 grid h-10 w-10 place-items-center rounded-full border border-[var(--s6-brass)]">
            <span className="h-2 w-2 rounded-full bg-[var(--s6-champagne)]" />
          </span>
          <h3 className="font-display text-[24px] font-semibold uppercase tracking-[0.02em] text-[var(--s6-warm-white)]">
            REQUEST RECEIVED
          </h3>
          <p className="mt-3 max-w-[36ch] text-[13px] leading-relaxed text-[var(--s6-muted-text)]">
            Your onboarding link is on its way to{' '}
            <span className="font-semibold text-[var(--s6-warm-white)]">{recipient}</span>.
            Check your inbox (and spam folder) — the link will take you straight to your carrier profile.
          </p>
          <div className="mt-6 border-t border-[var(--s6-border)] pt-6">
            <p className="font-tech text-[10px] tracking-[0.16em] text-[var(--s6-muted-text)]">EXPECTED RESPONSE</p>
            <p className="mt-1 font-display text-[28px] font-semibold text-[var(--s6-champagne)]">WITHIN 20 MINUTES</p>
          </div>
        </div>
      </div>
    );
  }

  /* ---- ERROR ---- */
  if (status === 'error') {
    const failure = result && !result.success ? result : null;
    const isRateLimited = failure?.kind === 'rate_limited';
    const isNetwork = failure?.kind === 'network';
    const headline = isRateLimited
      ? 'TOO MANY SUBMISSIONS'
      : isNetwork
        ? 'CONNECTION PROBLEM'
        : failure?.kind === 'validation'
          ? 'PLEASE FIX THE HIGHLIGHTED FIELDS'
          : 'WE COULDDN\'T COMPLETE THAT REQUEST';
    const body = isRateLimited
      ? 'Please wait a few minutes before trying again.'
      : isNetwork
        ? 'Check your network and try again.'
        : failure?.kind === 'validation'
          ? failure.message ?? 'Please fix the highlighted fields.'
          : failure?.message ?? 'Please try again.';

    return (
      <div
        data-s6="terminal"
        aria-live="assertive"
        className="relative rounded-[3px] border border-[var(--s6-border-brass)] bg-[var(--s6-graphite)] p-8 shadow-[0_18px_50px_rgba(0,0,0,0.35)]"
      >
        <div className="mb-8 flex items-center justify-between border-b border-[var(--s6-border)] pb-4">
          <span className="font-tech text-[10px] tracking-[0.18em] text-[var(--s6-muted-text)]">DISPATCH INTAKE</span>
          <span className="flex items-center gap-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s6-error)]">
            <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-[var(--s6-error)]" />
            {isRateLimited ? 'RATE LIMITED' : 'ERROR'}
          </span>
        </div>
        <div className="flex flex-col items-center py-8 text-center">
          <h3 className="font-display text-[20px] font-semibold uppercase text-[var(--s6-error)]">
            {headline}
          </h3>
          <p className="mt-3 text-[13px] text-[var(--s6-muted-text)]">{body}</p>
          {!isRateLimited && (
            <button
              type="button"
              onClick={resetToIdle}
              className="mt-6 inline-flex items-center gap-2 border border-[var(--s6-border-2)] px-5 py-3 text-[11px] font-semibold tracking-[0.16em] text-[var(--s6-warm-white)] transition-colors hover:border-[var(--s6-brass)]"
            >
              TRY AGAIN →
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ---- IDLE / SUBMITTING — the terminal ---- */
  return (
    <div data-s6="terminal" className="relative overflow-hidden rounded-[3px]">
      <div
        data-s6="depth"
        aria-hidden="true"
        className="absolute inset-0 rounded-[3px]"
        style={{ boxShadow: '0 18px 50px rgba(0,0,0,0.35), inset 0 0 0 1px rgba(212,176,106,0.05)' }}
      />
      <div data-s6="terminal-bg" aria-hidden="true" className="absolute inset-0 rounded-[3px] bg-[var(--s6-graphite)]" />
      <span data-s6="frame-top" aria-hidden="true" className="s6-frame-edge absolute left-0 top-0 z-20 h-px w-full origin-left" />
      <span data-s6="frame-right" aria-hidden="true" className="s6-frame-edge absolute right-0 top-0 z-20 h-full w-px origin-top" />
      <span data-s6="frame-bottom" aria-hidden="true" className="s6-frame-edge absolute bottom-0 left-0 z-20 h-px w-full origin-left" />
      <span data-s6="frame-left" aria-hidden="true" className="s6-frame-edge absolute left-0 top-0 z-20 h-full w-px origin-top" />
      <span
        data-s6="calib"
        aria-hidden="true"
        className="pointer-events-none absolute inset-y-0 left-0 z-20 w-1/5 opacity-0"
        style={{ background: 'linear-gradient(90deg, transparent, rgba(212,176,106,0.08), transparent)' }}
      />

      <div className="relative z-10 p-6 lg:p-8">
        <div className="flex items-center justify-between">
          <span className="font-tech text-[10px] tracking-[0.18em] text-[var(--s6-muted-text)]">DISPATCH INTAKE</span>
          <div className="flex items-center gap-4">
            <span data-s6="status-line" className="font-tech text-[9px] tracking-[0.12em] text-[var(--s6-muted-text)]">
              {String(validCount).padStart(2, '0')} / {String(requiredCount).padStart(2, '0')}
            </span>
            <span data-s6="status-cluster" className="flex items-center gap-2 font-tech text-[10px] tracking-[0.14em] text-[var(--s6-champagne)]">
              <span
                data-s6="status-dot"
                aria-hidden="true"
                className={`h-1.5 w-1.5 rounded-full ${isReady ? 'bg-[var(--s6-success)]' : 'bg-[var(--s6-champagne)]'}`}
              />
              {statusLabel}
            </span>
          </div>
        </div>
        <div data-s6="header-divider" aria-hidden="true" className="mt-4 h-px w-full origin-left bg-[var(--s6-border)]" />

        <form className="mt-6" onSubmit={handleSubmit} onFocus={() => onInteracted?.()} noValidate>
          <div className="grid gap-4 sm:grid-cols-2">
            {FIELD_CONFIGS.map((config) => {
              if (config.showWhen && !config.showWhen(formData)) return null;
              const required = isFieldRequired(config, formData);
              const placeholder = config.dynamicPlaceholder ? config.dynamicPlaceholder(formData) : config.placeholder;
              const isConditional = !!config.showWhen;
              const serverError = fieldErrors[config.key];
              return (
                <div
                  key={config.key}
                  className={`${config.fullWidth ? 'sm:col-span-2' : ''} ${isConditional ? 's6-conditional' : ''}`}
                >
                  <DispatchField
                    config={config}
                    value={formData[config.key] as string}
                    touched={!!touched[config.key] || !!serverError}
                    required={required}
                    placeholder={placeholder}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    serverError={serverError}
                  />
                </div>
              );
            })}
            <div data-s6-group="B" className="sm:col-span-2">
              <label
                htmlFor="dispatch-message"
                className="mb-1.5 flex items-baseline gap-2 text-[10px] font-semibold tracking-[0.14em] text-[var(--s6-muted-text)]"
              >
                HOW CAN WE HELP?
                <span className="font-tech text-[8.5px] tracking-[0.14em] text-[var(--s6-muted-text)]/60">OPTIONAL</span>
              </label>
              <textarea
                id="dispatch-message"
                rows={3}
                placeholder="Tell us more..."
                value={formData.message}
                onChange={(e) => handleChange('message', e.target.value)}
                className="w-full resize-none rounded-[2px] border border-[var(--s6-border)] bg-[var(--s6-raised)] px-3 py-2.5 text-[13px] text-[var(--s6-warm-white)] placeholder:text-[var(--s6-muted-text)]/60 transition-colors duration-200 focus:border-[var(--s6-brass)] focus:outline-none"
              />
            </div>
          </div>

          <div data-s6="consent" className="mt-5">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={formData.consent}
                onChange={(e) => handleChange('consent', e.target.checked)}
                onBlur={() => handleBlur('consent')}
                className="mt-0.5 h-4 w-4 shrink-0 rounded-[2px] border border-[var(--s6-border-2)] bg-[var(--s6-raised)] accent-[var(--s6-brass)]"
                aria-invalid={(touched.consent && !formData.consent) || !!fieldErrors.consent}
              />
              <span className="text-[11px] leading-relaxed text-[var(--s6-muted-text)]">
                I agree to the Privacy Policy and consent to being contacted.
              </span>
            </label>
            {fieldErrors.consent && (
              <p className="mt-1 text-[10px] text-[var(--s6-error)]" role="alert">
                {fieldErrors.consent}
              </p>
            )}
            {touched.consent && !formData.consent && !fieldErrors.consent && (
              <p className="mt-1 text-[10px] text-[var(--s6-error)]" role="alert">
                Consent is required
              </p>
            )}
          </div>

          <div data-s6="cta-row" className="mt-6">
            <button
              type="submit"
              disabled={status === 'submitting'}
              className="group/cta relative w-full overflow-hidden rounded-[2px] bg-[var(--s6-champagne)] px-6 py-3.5 text-[12px] font-semibold tracking-[0.16em] text-[#111820] transition-colors duration-200 hover:bg-[var(--s6-brass)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span aria-hidden="true" className="s6-cta-sweep pointer-events-none absolute inset-0" />
              <span aria-hidden="true" className={`s6-shimmer pointer-events-none absolute inset-0 overflow-hidden ${shimmer ? 'play' : ''}`} />
              {status === 'submitting' ? (
                <span className="relative flex items-center justify-center gap-3">
                  <span className="s6-submit-track relative h-[2px] w-16 overflow-hidden rounded-full">
                    <span className="s6-submit-signal absolute inset-y-0 left-0 w-1/4 rounded-full" />
                  </span>
                  DISPATCHING...
                </span>
              ) : (
                <span className="relative flex items-center justify-center gap-2">
                  GET DISPATCHED
                  <span aria-hidden="true" className="transition-transform duration-200 group-hover/cta:translate-x-1">→</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}