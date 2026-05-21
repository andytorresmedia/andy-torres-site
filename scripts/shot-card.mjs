// scripts/shot-card.mjs — open the case-study "project file" slab and screenshot it
// at rest and tilted, so we can eyeball the 3D thickness headlessly.
//   node scripts/shot-card.mjs [baseURL]   (default http://localhost:4173)

import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = 'verify-shots';
mkdirSync(OUT, { recursive: true });

const CACHED_CHROME =
  process.env.PLAYWRIGHT_CHROME ||
  `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell`;

const browser = await chromium.launch({
  executablePath: existsSync(CACHED_CHROME) ? CACHED_CHROME : undefined,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e && e.message)));

await page.goto(BASE + '/work/rockets', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2600); // loading screen (1400ms) + settle

await page.getByText('Open Project File').click({ timeout: 8000 }).catch((e) => errors.push('CLICK: ' + e.message));
await page.waitForTimeout(1300); // entrance + light sweep
await page.screenshot({ path: `${OUT}/slab-rest.png` });

// push cursor to the bottom-left of the card to turn it and reveal the right/top walls
await page.mouse.move(720, 450);
await page.waitForTimeout(300);
await page.mouse.move(440, 720);
await page.waitForTimeout(900);
await page.screenshot({ path: `${OUT}/slab-tilt.png` });

await browser.close();
const benign = /play\(\)|AbortError|NotAllowedError|favicon|ERR_|media resource|Autoplay/i;
const meaningful = errors.filter((e) => !benign.test(e));
console.log('errors:', JSON.stringify(meaningful, null, 2));
console.log(meaningful.length ? `❌ ${meaningful.length} error(s)` : '✅ clean');
process.exit(meaningful.length ? 1 : 0);
