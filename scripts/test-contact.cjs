// scripts/test-contact.cjs — unit test for api/contact.js (no network, no Vercel).
// Stubs the lazily-required `resend` module so we can assert the send path too.
//   node scripts/test-contact.cjs

const assert = require('node:assert');

// ── stub resend BEFORE requiring the handler (handler requires it lazily at call
//    time, so the cache entry will be picked up). ──
let lastSend = null;
const resendPath = require.resolve('resend');
require.cache[resendPath] = {
  id: resendPath,
  filename: resendPath,
  loaded: true,
  exports: {
    Resend: class {
      constructor(key) {
        this.key = key;
        this.emails = {
          send: async (args) => {
            lastSend = args;
            return { error: null };
          },
        };
      }
    },
  },
};

const handler = require('../api/contact.js');

function makeRes() {
  return {
    _status: null,
    _json: null,
    _headers: {},
    status(c) { this._status = c; return this; },
    json(o) { this._json = o; return this; },
    setHeader(k, v) { this._headers[k] = v; },
  };
}

const ENV_KEYS = ['RESEND_API_KEY', 'STUDIO_EMAIL', 'CONTACT_FROM', 'VERCEL_ENV'];
async function run(body, { method = 'POST', env = {}, headers = {} } = {}) {
  const saved = {};
  for (const k of ENV_KEYS) { saved[k] = process.env[k]; delete process.env[k]; }
  for (const [k, v] of Object.entries(env)) process.env[k] = v;
  lastSend = null;
  const res = makeRes();
  await handler({ method, body, headers }, res);
  for (const k of ENV_KEYS) { if (saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
  return res;
}

const CREDS = { RESEND_API_KEY: 'test_key', STUDIO_EMAIL: 'studio@frontrow.studio' };
const VALID = {
  name: 'Jane Doe',
  email: 'jane@example.com',
  company: 'Acme',
  type: 'Sports team / league',
  timeline: 'Standard',
  budget: 'Under $10K',
  message: 'We need a championship ring-reveal film.',
  elapsedMs: 9000,
};

let pass = 0;
let fail = 0;
async function test(name, fn) {
  try { await fn(); console.log('  ✓', name); pass += 1; }
  catch (e) { console.log('  ✗', name, '\n      ', e.message); fail += 1; }
}

(async () => {
  await test('GET → 405', async () => {
    const r = await run(VALID, { method: 'GET' });
    assert.strictEqual(r._status, 405);
  });

  await test('missing required field → 400', async () => {
    const r = await run({ ...VALID, message: '' });
    assert.strictEqual(r._status, 400);
  });

  await test('invalid email → 400', async () => {
    const r = await run({ ...VALID, email: 'not-an-email' });
    assert.strictEqual(r._status, 400);
  });

  await test('unrecognized budget → 400', async () => {
    const r = await run({ ...VALID, budget: '$1B+' });
    assert.strictEqual(r._status, 400);
    assert.match(r._json.error, /budget/i);
  });

  await test('missing creds + NON-production → 200 mock', async () => {
    const r = await run(VALID, { env: { VERCEL_ENV: 'development' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(r._json.ok, true);
    assert.strictEqual(r._json.mock, true);
  });

  await test('missing creds + preview → 200 mock (non-prod)', async () => {
    const r = await run(VALID, { env: { VERCEL_ENV: 'preview' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(r._json.mock, true);
  });

  await test('missing creds + PRODUCTION → 500 (fail loud, no silent drop)', async () => {
    const r = await run(VALID, { env: { VERCEL_ENV: 'production' } });
    assert.strictEqual(r._status, 500);
    assert.strictEqual(r._json.ok, false);
    assert.strictEqual(lastSend, null);
  });

  await test('honeypot filled → 200 ok but NOT sent (dropped)', async () => {
    const r = await run({ ...VALID, company_url: 'http://spam.example' }, { env: { ...CREDS, VERCEL_ENV: 'production' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(r._json.ok, true);
    assert.strictEqual(lastSend, null, 'should not have sent');
  });

  await test('submit too fast → 200 ok but NOT sent (dropped)', async () => {
    const r = await run({ ...VALID, elapsedMs: 400 }, { env: { ...CREDS, VERCEL_ENV: 'production' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(lastSend, null, 'should not have sent');
  });

  await test('valid + creds → 200, sends with replyTo=email', async () => {
    const r = await run(VALID, { env: { ...CREDS, VERCEL_ENV: 'production' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(r._json.ok, true);
    assert.ok(lastSend, 'should have sent');
    assert.strictEqual(lastSend.replyTo, VALID.email);
    assert.strictEqual(lastSend.to, CREDS.STUDIO_EMAIL);
    assert.match(lastSend.subject, /^New brief — Jane Doe/);
  });

  await test('subject collapses newlines in name (no header sprawl)', async () => {
    const r = await run({ ...VALID, name: 'Jane\nDoe\r\nInjected' }, { env: { ...CREDS, VERCEL_ENV: 'production' } });
    assert.strictEqual(r._status, 200);
    assert.strictEqual(lastSend.subject.indexOf('\n'), -1, 'subject must not contain newline');
    assert.strictEqual(lastSend.subject.indexOf('\r'), -1, 'subject must not contain CR');
    assert.match(lastSend.subject, /Jane Doe Injected/);
  });

  await test('name length is capped at 120', async () => {
    const long = 'a'.repeat(200);
    await run({ ...VALID, name: long }, { env: { ...CREDS, VERCEL_ENV: 'production' } });
    const m = lastSend.text.match(/Name:\s+(a+)/);
    assert.ok(m, 'name line present');
    assert.strictEqual(m[1].length, 120, `expected 120 chars, got ${m[1].length}`);
  });

  await test('rate limit: 6th rapid request from one IP → 429', async () => {
    const headers = { 'x-forwarded-for': '9.9.9.9' };
    const codes = [];
    for (let i = 0; i < 6; i += 1) {
      const r = await run(VALID, { env: { ...CREDS, VERCEL_ENV: 'production' }, headers });
      codes.push(r._status);
    }
    assert.deepStrictEqual(codes.slice(0, 5), [200, 200, 200, 200, 200], `first 5 should be 200, got ${codes}`);
    assert.strictEqual(codes[5], 429, `6th should be 429, got ${codes[5]}`);
  });

  console.log(`\ncontact handler: ${pass} passed, ${fail} failed`);
  process.exit(fail ? 1 : 0);
})();
