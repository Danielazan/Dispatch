/* ============ HelpChooser v4 (PART 4 / GAP-013 — portaled centered email composer) ============ */
'use client';
import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Phone, Mail, X, CircleHelp, ArrowLeft, Send } from 'lucide-react';
import { site } from '@/config/site';
import { useOnboarding } from '@/lib/onboarding/context';
import { obApi } from '@/lib/onboarding/api';

/* Local brand icon (lucide removed brand logos) */
function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
    </svg>
  );
}

type Variant = 'header' | 'sidebar' | 'rail';

const inputCls =
  'w-full h-9 bg-ink-950 border border-steel-700/40 rounded-[6px] px-3 text-[12px] text-ivory-50 placeholder:text-steel-600 focus:outline-none focus:border-brass-500/70 transition-colors';

export function HelpChooser({ variant }: { variant: Variant }) {
  const { state } = useOnboarding();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<'menu' | 'email'>('menu');
  const wrapRef = useRef<HTMLDivElement>(null);

  /* Prefill sources (session may still be loading — fall back to empty) */
  const lead = state.sessionData?.lead;
  const carrierId: string | undefined = state.sessionData?.carrier?.id;
  const appId = carrierId
    ? `AIK-${carrierId.slice(0, 4).toUpperCase()}-${carrierId.slice(4, 8).toUpperCase()}`
    : '';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
    const [formError, setFormError] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [mailOpened, setMailOpened] = useState(false);

  const c = site.supportChannels;
  const waHref = `https://wa.me/${c.whatsapp}?text=${encodeURIComponent(c.whatsappPrefill)}`;

  const close = () => {
    setOpen(false);
    setView('menu');
    setFormError(null);
    setMailOpened(false);
  };

  /* Escape + outside-click close (menu only — the email modal handles its own backdrop) */
  useEffect(() => {
    if (!open || view !== 'menu') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    const onDown = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) close();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [open, view]);

  /* Escape also closes the email modal */
  useEffect(() => {
    if (view !== 'email') return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') close(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [view]);

  const openEmailView = () => {
    setName((v) => v || lead?.contactName || '');
    setEmail((v) => v || lead?.email || '');
    setSubject((v) => v || `Carrier Onboarding Support${appId ? ` — Application ${appId}` : ''}`);
    setFormError(null);
    setMailOpened(false);
    setView('email');
  };

  /* Compose mailto — the user's own mail app sends. Token is NEVER included. */
    /* v5: DIRECT SEND — the backend delivers via emailService; no mail app needed. */
  const sendEmail = async () => {
    if (!message.trim()) { setFormError('Please write a short message so we know how to help.'); return; }
    if (!subject.trim()) { setFormError('Please add a subject line.'); return; }
    setFormError(null);
    setSending(true);
    setSent(false);
    try {
      await obApi.sendSupportMessage(state.token, {
        name: name.trim() || lead?.contactName || 'Carrier',
        email: email.trim() || lead?.email || '',
        subject: subject.trim(),
        message: message.trim(),
      });
      setSent(true);
      setMessage('');
    } catch (e: any) {
      if (e?.status === 429) setFormError('Too many messages — please wait a few minutes before trying again.');
      else setFormError(e?.message ?? 'Unable to send right now — please try again, or use the email-app link below.');
    } finally {
      setSending(false);
    }
  };

  const launcherCls =
    variant === 'header'
      ? 'flex items-center gap-3 group'
      : variant === 'sidebar'
        ? 'relative w-full flex items-center gap-3 px-4 py-3 rounded-[6px] text-left transition-colors text-steel-300 hover:text-ivory-100 hover:bg-ink-900'
        : 'mt-4 flex items-center justify-center gap-2 w-full py-2.5 rounded-[6px] border border-steel-700/40 text-[12px] font-semibold text-ivory-100 hover:border-brass-500/60 hover:text-brass-300 transition-colors';

  const panelPos = variant === 'rail' ? 'right-0' : variant === 'header' ? 'right-0' : 'left-0';

  return (
    <div className="relative" ref={wrapRef}>
      <button type="button" onClick={() => (open ? close() : setOpen(true))}
        className={launcherCls} aria-haspopup="dialog" aria-expanded={open}>
        {variant === 'header' && (
          <>
            <CircleHelp size={18} strokeWidth={1.5} className="text-ivory-100 group-hover:text-brass-400 transition-colors" />
            <span className="leading-tight text-left">
              <span className="block text-[13px] font-semibold text-ivory-50">Need help?</span>
              <span className="block text-[11px] text-steel-400">Contact support</span>
            </span>
          </>
        )}
        {variant === 'sidebar' && (
          <>
            <CircleHelp size={17} strokeWidth={1.5} className="text-steel-400" />
            <span className="text-[13px]">Help & Support</span>
          </>
        )}
        {variant === 'rail' && (
          <>
            <Mail size={14} /> {site.support.cta}
          </>
        )}
      </button>

      {/* ---- MENU — small anchored dropdown (unchanged) ---- */}
      {open && view === 'menu' && (
        <div role="dialog" aria-label="Get help"
          className={`absolute z-50 mt-2 w-[290px] rounded-[10px] border border-steel-700/30 bg-ink-900 p-4 shadow-[0_18px_50px_rgba(0,0,0,0.5)] ${panelPos}`}>
          <div className="flex items-start justify-between">
            <h3 className="text-[15px] font-semibold text-ivory-50">Get Help</h3>
            <button type="button" onClick={close} aria-label="Close help menu"
              className="grid h-7 w-7 place-items-center rounded-[6px] border border-steel-700/40 text-steel-400 hover:text-ivory-100 transition-colors">
              <X size={13} />
            </button>
          </div>
          <p className="mt-1 text-[11px] text-steel-400">Choose how you'd like to reach us · {c.hours}</p>

          <div className="mt-3 space-y-2.5">
            <a href={c.phoneHref}
              className="flex items-center gap-3 rounded-[8px] border border-steel-700/30 bg-ink-950/60 px-3.5 py-3 hover:border-brass-500/50 transition-colors">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] border border-steel-700/40 text-brass-400"><Phone size={15} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ivory-50">Call us</span>
                <span className="block text-[11px] font-tech text-steel-400">{c.phoneLabel}</span>
              </span>
            </a>

            <a href={waHref} target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-3 rounded-[8px] border border-steel-700/30 bg-ink-950/60 px-3.5 py-3 hover:border-brass-500/50 transition-colors">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] border border-steel-700/40 text-status-live"><WhatsAppIcon size={15} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ivory-50">WhatsApp</span>
                <span className="block text-[11px] text-steel-400">Message us — opens in a new tab</span>
              </span>
            </a>

            <button type="button" onClick={openEmailView}
              className="w-full flex items-center gap-3 rounded-[8px] border border-steel-700/30 bg-ink-950/60 px-3.5 py-3 hover:border-brass-500/50 transition-colors text-left">
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[6px] border border-steel-700/40 text-ivory-100"><Mail size={15} /></span>
              <span className="min-w-0">
                <span className="block text-[13px] font-semibold text-ivory-50">Email</span>
                <span className="block text-[11px] font-tech text-steel-400 truncate">{c.email}</span>
              </span>
            </button>
          </div>

          <p className="mt-3 text-[10px] leading-relaxed text-steel-500">
            Have your Application ID ready (top-right of this page) so we can find your file faster.
          </p>
        </div>
      )}

      {/* ---- EMAIL COMPOSER — PORTALED to <body> so it centers over the MAIN section
             regardless of GSAP transforms on header/sidebar/rail (Scar S12) ---- */}
      {open && view === 'email' && createPortal(
        <div className="fixed inset-0 z-[100] grid place-items-center bg-ink-950/70 p-4" onMouseDown={close}>
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Email support"
            onMouseDown={(e) => e.stopPropagation()}
            className="w-full max-w-md max-h-[85vh] overflow-y-auto ob-scroll rounded-[10px] border border-steel-700/30 bg-ink-900 p-5 shadow-[0_18px_50px_rgba(0,0,0,0.5)]"
          >
            <div className="flex items-center justify-between">
              <button type="button" onClick={() => setView('menu')}
                className="flex items-center gap-1.5 text-[11px] text-steel-400 hover:text-ivory-100 transition-colors">
                <ArrowLeft size={12} /> All options
              </button>
              <button type="button" onClick={close} aria-label="Close email form"
                className="grid h-7 w-7 place-items-center rounded-[6px] border border-steel-700/40 text-steel-400 hover:text-ivory-100 transition-colors">
                <X size={13} />
              </button>
            </div>

            <h3 className="mt-2 text-[15px] font-semibold text-ivory-50">Email us</h3>
            <p className="mt-1 text-[11px] font-tech text-steel-400">to: {c.email}</p>

            <div className="mt-3 space-y-2.5">
              <div>
                <label htmlFor="hc-name" className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-steel-500">Your name</label>
                <input id="hc-name" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" />
              </div>
              <div>
                <label htmlFor="hc-email" className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-steel-500">Your email</label>
                <input id="hc-email" type="email" className={inputCls} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="name@company.com" />
              </div>
              <div>
                <label htmlFor="hc-subject" className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-steel-500">Subject</label>
                <input id="hc-subject" className={inputCls} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="How can we help?" />
              </div>
              <div>
                <label htmlFor="hc-message" className="mb-1 block text-[10px] uppercase tracking-[0.12em] text-steel-500">
                  Message <span className="text-red-400">*</span>
                </label>
                <textarea id="hc-message" rows={5} className={`${inputCls} h-auto py-2 resize-none`} value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Tell us what you need — e.g. “My MC letter upload failed” or “Question about my payment setup.”" />
              </div>
            </div>

            {formError && <p className="mt-2 text-[11px] text-red-400" role="alert">{formError}</p>}

            <button type="button" onClick={sendEmail} disabled={sending}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-[7px] bg-brass-500 hover:bg-brass-400 py-2.5 text-[12px] font-display font-semibold uppercase tracking-[0.08em] text-ink-950 transition-colors disabled:opacity-60">
              <Send size={13} /> {sending ? 'Sending…' : 'Send Email'}
            </button>

            {sent && (
              <p className="mt-2 text-[11px] text-status-live">
                Message sent — we'll reply to {email.trim() || 'your email'} shortly.
              </p>
            )}

            <a
              href={`mailto:${c.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`}
              className="mt-2 block text-[10px] text-steel-500 underline decoration-steel-700/50 hover:text-steel-300 transition-colors">
              Having trouble? Open in your email app instead
            </a>

            {mailOpened && (
              <p className="mt-2 text-[11px] text-status-live">
                Your email app should now be open with everything filled in — press Send there to finish.
              </p>
            )}

            <p className="mt-2 text-[10px] leading-relaxed text-steel-500">
              We attach your name, reply email and Application ID automatically so we can find your file fast.
            </p>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}