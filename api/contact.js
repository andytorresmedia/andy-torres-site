// api/contact.js — Vercel serverless function (Node runtime, CommonJS).
//
// Receives a brief from the Front Row contact form and emails it to the studio
// inbox via Resend. Lives at the repo root under /api so Vercel auto-deploys it
// as a serverless function — it is NOT part of the CRA bundle.
//
// Required env vars (set in Vercel → Project → Settings → Environment Variables):
//   RESEND_API_KEY  — Resend API key (https://resend.com/api-keys)
//   STUDIO_EMAIL    — destination inbox for briefs (e.g. hello@andytorresfilms.com)
// Optional:
//   CONTACT_FROM    — verified Resend sender. Defaults to Resend's shared
//                     onboarding sender so the function works before a domain
//                     is verified. Replace with a verified domain sender in prod.
//
// Mock mode: if RESEND_API_KEY/STUDIO_EMAIL are unset, the function logs the brief
// and returns { ok: true, mock: true } so the form's success state is testable —
// but ONLY outside production. In production, missing creds are a misconfiguration
// that would silently drop a real lead, so we fail loud (5xx) instead, letting the
// form show its "email us directly" fallback. (Vercel sets VERCEL_ENV.)

// Canonical budget ranges. MUST stay in sync with BUDGETS in src/content/site.ts
// (the form's <select>). The src/ and api/ trees can't share a module — CRA forbids
// importing from outside src/, and this function isn't transpiled — so this is a
// deliberate mirror, not a duplicate to be DRY-ed away.
const ALLOWED_BUDGETS = ['Under $10K', '$10K – $25K', '$25K – $50K', '$50K – $100K', '$100K+', 'Not sure yet — let\'s talk'];

// Field length caps — keep briefs sane and the inbox un-bloatable.
const MAX = { name: 120, email: 200, company: 120, type: 60, timeline: 60, budget: 40, message: 5000, link: 1000, howHeard: 60 };

// A human takes more than a couple seconds to fill the form; near-instant submits
// are bots. elapsedMs is measured on the client against its own clock, so there's
// no server/client clock-skew to worry about.
const MIN_FILL_MS = 2000;

// Best-effort in-memory per-IP rate limit (sliding window). Serverless instances are
// ephemeral and not shared, so this curbs bursts within a warm instance but is NOT a
// durable cross-instance limit — back it with Vercel KV / Upstash for that, or add a
// Cloudflare Turnstile challenge for real bot resistance. Fails OPEN so a genuine lead
// is never blocked by a limiter hiccup.
const RATE_LIMIT = { windowMs: 60000, max: 5 };
const rateHits = new Map(); // ip -> timestamps[]  (module scope: persists across warm invocations)

function clientIp(req) {
  const fwd = req.headers && req.headers['x-forwarded-for'];
  if (typeof fwd === 'string' && fwd) return fwd.split(',')[0].trim();
  return (req.socket && req.socket.remoteAddress) || '';
}

function rateLimited(ip, now) {
  if (!ip) return false;
  try {
    const cutoff = now - RATE_LIMIT.windowMs;
    const hits = (rateHits.get(ip) || []).filter((t) => t > cutoff);
    hits.push(now);
    rateHits.set(ip, hits);
    if (rateHits.size > 5000) {
      for (const [key, times] of rateHits) {
        if (!times.some((t) => t > cutoff)) rateHits.delete(key);
      }
    }
    return hits.length > RATE_LIMIT.max;
  } catch (_e) {
    return false; // fail open
  }
}

function safeParse(value) {
  if (!value) return {};
  if (typeof value === 'object') return value;
  try {
    return JSON.parse(value);
  } catch (_err) {
    return {};
  }
}

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

// Collapse control chars / newlines to single spaces — for values placed in the
// email subject line, where a raw newline has no business. (Done char-by-char to
// avoid embedding control-character literals in this source file.)
function oneLine(str) {
  const s = String(str == null ? '' : str);
  let out = '';
  for (let i = 0; i < s.length; i += 1) {
    const code = s.charCodeAt(i);
    out += code < 32 || code === 127 ? ' ' : s[i];
  }
  return out.replace(/\s{2,}/g, ' ').trim();
}

const cap = (str, n) => (str.length > n ? str.slice(0, n) : str);

// Reference link -> a safe clickable href, or '' if it isn't a plain http(s) URL.
// Prepends https:// when the user omits a scheme; rejects everything else (javascript:,
// data:, mailto:, …) so a hostile value can never become a dangerous href in the brief
// email. When this returns '', the raw text is still shown escaped, so the studio never
// loses what was actually typed.
function safeHref(str) {
  const t = String(str == null ? '' : str).trim();
  if (!t) return '';
  try {
    const u = new URL(/^https?:\/\//i.test(t) ? t : `https://${t}`);
    if ((u.protocol === 'http:' || u.protocol === 'https:') && u.hostname.includes('.')) return u.href;
  } catch (_e) {
    /* not a parseable URL — fall through to '' */
  }
  return '';
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const body = safeParse(req.body);

  // ── Spam guards (cheap, no deps). Soft-accept (200 ok) so bots don't learn the
  //    trap; the brief is simply dropped. ──
  if (typeof body.company_url === 'string' && body.company_url.trim() !== '') {
    // eslint-disable-next-line no-console
    console.warn('[contact] honeypot tripped — dropping submission.');
    return res.status(200).json({ ok: true });
  }
  const elapsedMs = Number(body.elapsedMs);
  if (Number.isFinite(elapsedMs) && elapsedMs >= 0 && elapsedMs < MIN_FILL_MS) {
    // eslint-disable-next-line no-console
    console.warn('[contact] submission too fast (', elapsedMs, 'ms) — dropping.');
    return res.status(200).json({ ok: true });
  }

  // Burst guard for traffic that slips past the honeypot/timing checks.
  if (rateLimited(clientIp(req), Date.now())) {
    return res.status(429).json({ ok: false, error: 'Too many requests — try again in a minute, or email us directly.' });
  }

  const name = cap((body.name || '').trim(), MAX.name);
  const email = cap((body.email || '').trim(), MAX.email);
  const company = cap((body.company || '').trim(), MAX.company);
  const type = cap((body.type || '').trim(), MAX.type);
  const timeline = cap((body.timeline || '').trim(), MAX.timeline);
  const budget = cap((body.budget || '').trim(), MAX.budget);
  const message = cap((body.message || '').trim(), MAX.message);
  const link = cap((body.link || '').trim(), MAX.link);
  const howHeard = cap((body.howHeard || '').trim(), MAX.howHeard);
  const linkHref = safeHref(link);

  // Validation — mirror the form's required fields.
  if (!name || !email || !type || !timeline || !budget || !message) {
    return res.status(400).json({ ok: false, error: 'Please fill in every required field.' });
  }
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
    return res.status(400).json({ ok: false, error: 'That email address looks invalid.' });
  }
  if (budget && !ALLOWED_BUDGETS.includes(budget)) {
    return res.status(400).json({ ok: false, error: 'Unrecognized budget range.' });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const to = process.env.STUDIO_EMAIL;
  const from = process.env.CONTACT_FROM || 'Front Row <onboarding@resend.dev>';
  const isProduction = process.env.VERCEL_ENV === 'production';

  // No creds configured. In production this would SILENTLY DROP a real lead behind a
  // false "Brief received" — so fail loud and let the form show its "email us
  // directly" fallback. Outside production (local dev / preview), stay in mock mode
  // so the success state can be exercised end-to-end.
  if (!apiKey || !to) {
    if (isProduction) {
      // eslint-disable-next-line no-console
      console.error('[contact] MISCONFIG: RESEND_API_KEY/STUDIO_EMAIL unset in production — brief NOT delivered for:', email);
      return res.status(500).json({ ok: false, error: 'Our inbox is briefly unavailable. Please email us directly.' });
    }
    // eslint-disable-next-line no-console
    console.warn('[contact] RESEND_API_KEY or STUDIO_EMAIL not set — mock mode. Brief from:', name, email);
    return res.status(200).json({ ok: true, mock: true });
  }

  const lines = [
    `Name:      ${name}`,
    `Email:     ${email}`,
    company ? `Company:   ${company}` : null,
    `Type:      ${type}`,
    `Timeline:  ${timeline}`,
    `Budget:    ${budget}`,
    howHeard ? `Heard via: ${howHeard}` : null,
    '',
    'Brief:',
    message,
    link ? `Reference: ${link}` : null,
  ].filter(Boolean);

  const html = `
    <div style="font-family:ui-monospace,Menlo,monospace;background:#0b0b0c;color:#f4efe6;padding:28px;">
      <div style="font-size:11px;letter-spacing:0.22em;color:#ff5b1f;text-transform:uppercase;">● New brief received</div>
      <h2 style="font-family:Arial,sans-serif;margin:12px 0 20px;color:#f4efe6;">${escapeHtml(name)}${company ? ` · ${escapeHtml(company)}` : ''}</h2>
      <table style="border-collapse:collapse;font-size:14px;line-height:1.7;">
        <tr><td style="color:#888;padding-right:18px;">Email</td><td><a href="mailto:${escapeHtml(email)}" style="color:#ff7a3e;">${escapeHtml(email)}</a></td></tr>
        <tr><td style="color:#888;padding-right:18px;">Project type</td><td>${escapeHtml(type)}</td></tr>
        <tr><td style="color:#888;padding-right:18px;">Timeline</td><td>${escapeHtml(timeline)}</td></tr>
        <tr><td style="color:#888;padding-right:18px;">Budget</td><td>${escapeHtml(budget)}</td></tr>
        ${howHeard ? `<tr><td style="color:#888;padding-right:18px;">How heard</td><td>${escapeHtml(howHeard)}</td></tr>` : ''}
      </table>
      <div style="margin-top:22px;padding-top:18px;border-top:1px solid #25262a;">
        <div style="color:#888;font-size:12px;margin-bottom:8px;">Brief</div>
        <div style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</div>
      </div>
      ${link ? `<div style="margin-top:18px;padding-top:14px;border-top:1px solid #25262a;">
        <div style="color:#888;font-size:12px;margin-bottom:6px;">Reference link</div>
        ${linkHref
          ? `<a href="${escapeHtml(linkHref)}" style="color:#ff7a3e;word-break:break-all;">${escapeHtml(link)}</a>`
          : `<span style="word-break:break-all;">${escapeHtml(link)}</span>`}
      </div>` : ''}
    </div>`;

  try {
    // Required lazily so mock mode works even if the dep is absent locally.
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New brief — ${oneLine(name)}${company ? ` · ${oneLine(company)}` : ''}`,
      text: lines.join('\n'),
      html,
    });
    if (error) {
      // eslint-disable-next-line no-console
      console.error('[contact] Resend error:', error);
      return res.status(502).json({ ok: false, error: 'Could not send right now. Email us directly.' });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('[contact] Unexpected error:', err);
    return res.status(500).json({ ok: false, error: 'Server error. Email us directly.' });
  }
};
