// scripts/shot-card.mjs — open the case-study "project file" slab, screenshot it,
// and verify the tabs are clickable by their word (the 3D hit-area bug).
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
await page.getByText('Open Project File').click({ timeout: 8000 }).catch((e) => errors.push('OPEN: ' + e.message));
await page.waitForTimeout(1300); // entrance + light sweep
await page.screenshot({ path: `${OUT}/slab-rest.png` }); // straight-facing at rest

// CLICK RELIABILITY: click each tab by its WORD; confirm the tab's content renders.
const checks = [['Gallery', '.cs-gallery'], ['R&D', '.cs-rd-grid'], ['About', '.cs-about-row']];
const tabResult = {};
for (const [name, sel] of checks) {
  try {
    await page.locator('.cs-card-tabs .cs-tab', { hasText: name }).click({ timeout: 5000 });
    await page.waitForTimeout(450);
    tabResult[name] = await page.locator(sel).first().isVisible();
  } catch (e) { tabResult[name] = false; errors.push(`TAB ${name}: ` + e.message); }
}
await page.screenshot({ path: `${OUT}/slab-tabs.png` });

// tilt to show the thickness on the edges
await page.mouse.move(720, 450);
await page.waitForTimeout(250);
await page.mouse.move(470, 700);
await page.waitForTimeout(800);
await page.screenshot({ path: `${OUT}/slab-tilt.png` });

await browser.close();
const benign = /play\(\)|AbortError|NotAllowedError|favicon|ERR_|media resource|Autoplay/i;
const meaningful = errors.filter((e) => !benign.test(e));
const tabsPass = Object.values(tabResult).every(Boolean);
console.log('tab clicks open their content:', JSON.stringify(tabResult), tabsPass ? '✅' : '❌');
console.log('console errors:', JSON.stringify(meaningful, null, 2));
console.log(meaningful.length || !tabsPass ? '❌ issues' : '✅ clean');
process.exit(meaningful.length || !tabsPass ? 1 : 0);
