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
// If RESEND_API_KEY or STUDIO_EMAIL are unset (local dev / pre-launch), the
// function runs in "mock" mode: it logs the brief and returns { ok: true, mock: true }
// instead of 500-ing, so the form's success state can be exercised end-to-end.

const ALLOWED_BUDGETS = ['Under $10K', '$10K – $25K', '$25K – $50K', '$50K – $100K', '$100K+'];

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

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed.' });
  }

  const body = safeParse(req.body);
  const name = (body.name || '').trim();
  const email = (body.email || '').trim();
  const company = (body.company || '').trim();
  const type = (body.type || '').trim();
  const timeline = (body.timeline || '').trim();
  const budget = (body.budget || '').trim();
  const message = (body.message || '').trim();

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

  // Mock mode: no creds configured. Don't fail the user — log and succeed.
  if (!apiKey || !to) {
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
    '',
    'Brief:',
    message,
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
      </table>
      <div style="margin-top:22px;padding-top:18px;border-top:1px solid #25262a;">
        <div style="color:#888;font-size:12px;margin-bottom:8px;">Brief</div>
        <div style="font-family:Arial,sans-serif;white-space:pre-wrap;line-height:1.6;">${escapeHtml(message)}</div>
      </div>
    </div>`;

  try {
    // Required lazily so mock mode works even if the dep is absent locally.
    const { Resend } = require('resend');
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from,
      to,
      replyTo: email,
      subject: `New brief — ${name}${company ? ` · ${company}` : ''}`,
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
