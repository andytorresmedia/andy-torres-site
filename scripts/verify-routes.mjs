// scripts/verify-routes.mjs — headless route smoke test.
// Loads each route in headless Chromium, captures console errors + uncaught page
// errors, and screenshots each. Exits non-zero if any meaningful console errors.
//
//   node scripts/verify-routes.mjs [baseURL]   (default http://localhost:4173)
//
// Run it against a static server of the production build, e.g.:
//   npx serve -s build -l 4173 &   then   node scripts/verify-routes.mjs

import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const ROUTES = [
  { path: '/', name: 'home' },
  { path: '/work', name: 'work' },
  { path: '/work/rockets', name: 'case-study' },
  { path: '/about', name: 'about' },
  { path: '/contact', name: 'contact' },
];
const OUT = 'verify-shots';
mkdirSync(OUT, { recursive: true });

// benign noise to ignore: autoplay rejections, favicon, media network blips
const BENIGN = /play\(\) (request|failed)|AbortError|NotAllowedError|favicon|ERR_|the media resource|Autoplay/i;

// Playwright 1.60 pins a chromium build that isn't cached; reuse the cached
// headless shell (1217) if present, else fall back to Playwright's default.
const CACHED_CHROME =
  process.env.PLAYWRIGHT_CHROME ||
  `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell`;
const browser = await chromium.launch({
  executablePath: existsSync(CACHED_CHROME) ? CACHED_CHROME : undefined,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const results = [];
let total = 0;

for (const route of ROUTES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const errors = [];
  const badResponses = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push('PAGEERROR: ' + (err && err.message)));
  // explicit asset-404 detection (e.g. a mis-pathed client logo)
  page.on('response', (resp) => {
    const s = resp.status();
    const url = resp.url();
    if (s >= 400 && url.startsWith(BASE) && !/favicon/.test(url)) {
      badResponses.push(`${s} ${url.replace(BASE, '')}`);
    }
  });

  // networkidle won't fire with looping autoplay video — use domcontentloaded + settle.
  await page.goto(BASE + route.path, { waitUntil: 'domcontentloaded', timeout: 30000 }).catch((e) => {
    errors.push('GOTO: ' + e.message);
  });
  await page.waitForTimeout(2600);
  await page.screenshot({ path: `${OUT}/${route.name}.png` }).catch(() => {});

  const meaningful = errors.filter((e) => !BENIGN.test(e));
  results.push({ route: route.path, errors: meaningful, badResponses });
  total += meaningful.length + badResponses.length;
  await ctx.close();
}

await browser.close();
console.log(JSON.stringify(results, null, 2));
console.log(total === 0 ? '\n✅ No meaningful console errors across routes.' : `\n❌ ${total} console error(s).`);
process.exit(total ? 1 : 0);
