// ContactPage.jsx — primary conversion. Posts the brief to /api/contact (Vercel
// serverless → Resend). In local dev there's no function, so failures fall back
// to the success state (mock OK); in production, real errors surface inline.

import { useState, Fragment } from 'react';
import { STUDIO_EMAIL } from '../content/site';

const IS_DEV = process.env.NODE_ENV === 'development';

// TODO(social): replace with the studio's real profile URLs.
const SOCIALS = {
  instagram: 'https://instagram.com',
  vimeo: 'https://vimeo.com',
  linkedin: 'https://www.linkedin.com',
};

export function ContactPage() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', type: '', timeline: '', budget: '', message: '',
  });
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        setSent(true);
      } else if (IS_DEV) {
        setSent(true); // no serverless function under CRA dev — mock success
      } else {
        let msg = 'Something went wrong. Email us directly.';
        try {
          const data = await res.json();
          if (data && data.error) msg = data.error;
        } catch (_e) {
          /* non-JSON response */
        }
        setError(msg);
      }
    } catch (_err) {
      if (IS_DEV) setSent(true);
      else setError('Network error — please email us directly.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Fragment>
      <section className="contact-clean" data-screen-label="01 Contact">
        <div className="contact-clean-head">
          <h1 className="contact-clean-title">
            Let&apos;s make <em>the moment.</em>
          </h1>
        </div>

        <div className="contact-body">
          {sent ? (
            <div style={{ padding: '80px 0', textAlign: 'center' }}>
              <div className="mono" style={{ color: 'var(--accent-live)', marginBottom: 22, letterSpacing: '0.18em' }}>
                Brief received
              </div>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(48px,7vw,120px)', lineHeight: 0.9, marginBottom: 18 }}>
                Thanks, {form.name || 'we got it'}.
              </div>
              <p style={{ color: 'var(--bone)', fontSize: 18, maxWidth: '54ch', margin: '0 auto' }}>
                We&apos;ll be in touch within one business day at{' '}
                <em style={{ color: 'var(--paper)', fontStyle: 'normal' }}>{form.email || 'the email you provided'}</em>.
              </p>
            </div>
          ) : (
            <form className="contact-form" onSubmit={submit}>
              <div className="field-row">
                <div className="field">
                  <label>Name</label>
                  <input required value={form.name} onChange={set('name')} placeholder="Full name" />
                </div>
                <div className="field">
                  <label>Email</label>
                  <input required type="email" value={form.email} onChange={set('email')} placeholder="you@company.com" />
                </div>
              </div>

              <div className="field">
                <label>Company / Team</label>
                <input value={form.company} onChange={set('company')} placeholder="Team, league, agency, brand" />
              </div>

              <div className="field-row">
                <div className="field">
                  <label>Project type</label>
                  <select required value={form.type} onChange={set('type')}>
                    <option value="">Pick a lane…</option>
                    <option>Sports team / league</option>
                    <option>Broadcast / live event</option>
                    <option>Agency / production</option>
                    <option>Entertainment / music</option>
                    <option>Immersive / in-venue</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="field">
                  <label>Timeline</label>
                  <select required value={form.timeline} onChange={set('timeline')}>
                    <option value="">When is air?</option>
                    <option>Rush · &lt; 2 weeks</option>
                    <option>Standard · 2 – 6 weeks</option>
                    <option>Long-form · 6 – 12 weeks</option>
                    <option>Strategic · 3+ months</option>
                    <option>Just exploring</option>
                  </select>
                </div>
              </div>

              <div className="field">
                <label>Budget</label>
                <select required value={form.budget} onChange={set('budget')}>
                  <option value="">Pick a range…</option>
                  <option>Under $10K</option>
                  <option>$10K – $25K</option>
                  <option>$25K – $50K</option>
                  <option>$50K – $100K</option>
                  <option>$100K+</option>
                </select>
              </div>

              <div className="field">
                <label>Brief</label>
                <textarea required value={form.message} onChange={set('message')} placeholder="What is it, who's it for, and what does it have to do?" />
              </div>

              {error && (
                <div className="mono" style={{ color: 'var(--accent-live)', marginBottom: 8, letterSpacing: '0.08em' }}>
                  {error} — <a href={`mailto:${STUDIO_EMAIL}`} style={{ color: 'var(--paper)' }}>{STUDIO_EMAIL}</a>
                </div>
              )}

              <button type="submit" className="contact-submit" disabled={submitting}>
                {submitting ? 'Sending…' : 'Send the brief →'}
              </button>
            </form>
          )}
        </div>

        <div className="contact-follow">
          <a className="social-link" aria-label="Instagram" href={SOCIALS.instagram} target="_blank" rel="noreferrer" data-cursor="link" data-cursor-label="Instagram">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="3" width="18" height="18" rx="5" />
              <circle cx="12" cy="12" r="4.2" />
              <circle cx="17.5" cy="6.5" r="1.1" fill="currentColor" />
            </svg>
          </a>
          <a className="social-link" aria-label="Vimeo" href={SOCIALS.vimeo} target="_blank" rel="noreferrer" data-cursor="link" data-cursor-label="Vimeo">
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M22.4 7.7c-.1 2.2-1.6 5.2-4.6 9-3.1 4-5.7 6-7.9 6-1.3 0-2.5-1.3-3.5-3.8L4.5 12.9c-.7-2.5-1.5-3.8-2.3-3.8-.2 0-.7.3-1.6.9L0 8.9C2.6 6.6 5.1 4.1 6.2 4c1.9-.2 2.7 1.8 3.4 5.9.5 2.6 1 4.3 1.6 4.3.4 0 1-.7 1.8-2 .8-1.3 1.2-2.4 1.3-3.1.2-1.5-.4-2.3-1.8-2.3-.6 0-1.3.2-2 .5C11.7 4.9 14 3.4 16.3 3.6c1.6.1 2.4.7 2.5 2 .1 1.5.6 1.6 1.4.1 1.7-2 2.8-1.8 2.9 2z" />
            </svg>
          </a>
          <a className="social-link" aria-label="LinkedIn" href={SOCIALS.linkedin} target="_blank" rel="noreferrer" data-cursor="link" data-cursor-label="LinkedIn">
            <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
              <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5C0 2.12 1.11 1 2.5 1s2.48 1.12 2.48 2.5zM0 8h5v16H0V8zm7.5 0H12v2.16h.07c.62-1.18 2.14-2.42 4.41-2.42 4.72 0 5.59 3.11 5.59 7.15V24h-5v-7.1c0-1.69-.03-3.86-2.35-3.86-2.35 0-2.72 1.84-2.72 3.74V24h-5V8z" />
            </svg>
          </a>
        </div>
      </section>
    </Fragment>
  );
}
