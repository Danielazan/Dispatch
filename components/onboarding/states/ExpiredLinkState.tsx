/* ============ ExpiredLinkState v2 (PART 3 / GAP-005) ============ */
'use client';
import { useState } from 'react';
import { useOnboarding } from '@/lib/onboarding/context';
import { obApi } from '@/lib/onboarding/api';
import { Clock, Mail, AlertCircle, CheckCircle2 } from 'lucide-react';

type ResendState = 'idle' | 'sending' | 'sent' | 'rate_limited' | 'error';

export function ExpiredLinkState() {
  const { state } = useOnboarding();
  const [resendState, setResendState] = useState<ResendState>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleResend = async () => {
    if (resendState === 'sending' || resendState === 'sent') return;
    setResendState('sending');
    setErrorMessage(null);
    try {
      await obApi.resendLink(state.token);
      setResendState('sent');
    } catch (e: any) {
      if (e?.status === 429) {
        setResendState('rate_limited');
      } else if (e?.status === 423) {
        setResendState('error');
        setErrorMessage('This application has already been submitted.');
      } else if (e?.status === 410) {
        setResendState('error');
        setErrorMessage('This onboarding link has been revoked. Please contact support.');
      } else {
        setResendState('error');
        setErrorMessage(e?.message ?? 'Unable to resend the link. Please try again later.');
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center p-12">
      <div className="text-center max-w-md">
        <div className="mx-auto mb-6 grid h-14 w-14 place-items-center rounded-full border border-brass-500/30 bg-brass-500/10">
          <Clock size={24} className="text-brass-400" />
        </div>

        <h1 className="font-display text-3xl text-ivory-50 mb-3">Link Expired</h1>
        <p className="text-steel-400 text-sm mb-8 leading-relaxed">
          For security, onboarding links expire after a period of inactivity. Your progress up to the
          last save is safely stored — request a fresh link to continue where you left off.
        </p>

        {resendState === 'sent' ? (
          <div className="rounded-[8px] border border-status-live/40 bg-status-live/5 px-5 py-4 text-left">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 size={16} className="text-status-live" />
              <p className="text-[13px] font-semibold text-status-live">New link sent</p>
            </div>
            <p className="text-[12px] leading-relaxed text-steel-300">
              Check your inbox (and spam folder). Your previous link no longer works — use the new one
              to resume your application.
            </p>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendState === 'sending' || resendState === 'rate_limited'}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brass-500 hover:bg-brass-400 text-ink-950 font-display uppercase tracking-wider text-[13px] font-semibold rounded-[7px] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Mail size={16} />
              {resendState === 'sending' ? 'Sending…' : 'Resend Link'}
            </button>

            {resendState === 'rate_limited' && (
              <p className="mt-4 text-[12px] text-brass-300">
                Too many resend attempts — please wait a while before requesting another link.
              </p>
            )}

            {resendState === 'error' && errorMessage && (
              <div className="mt-4 flex items-start gap-2 text-left rounded-[6px] border border-red-500/30 bg-red-500/5 px-4 py-3">
                <AlertCircle size={14} className="text-red-400 shrink-0 mt-0.5" />
                <p className="text-[12px] text-red-300">{errorMessage}</p>
              </div>
            )}

            <p className="mt-6 text-[11px] text-steel-500">
              Didn't receive the original email? Check your spam folder or contact support.
            </p>
          </>
        )}
      </div>
    </div>
  );
}