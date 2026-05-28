// scripts/probe-gallery-nav.mjs — regression probe for the case-study card's dynamic
// interactions that headless tooling CAN exercise (Chromium only; iOS-Safari pointer
// delivery still needs manual QA):
//   • dialog focus: focus moves to the close button on open, back to the trigger on close
//   • gallery nav: click right/left third, ArrowRight, and WHEEL (the path whose
//     handlers were re-bound by the useCallback refactor)

import { chromium } from 'playwright';
import { existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const CACHED_CHROME =
  process.env.PLAYWRIGHT_CHROME ||
  `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell`;

const browser = await chromium.launch({
  executablePath: existsSync(CACHED_CHROME) ? CACHED_CHROME : undefined,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();

const count = () => page.evaluate(() => {
  const el = document.querySelector('.cs-gallery-caption .count');
  return el ? parseInt(el.textContent.trim(), 10) : null;
});
const activeClass = () => page.evaluate(() => document.activeElement ? (document.activeElement.className || '') : '');

const rows = [];
const check = (name, ok, detail = '') => rows.push({ name, ok, detail });

await page.goto(BASE + '/work/rockets', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForSelector('.cs-details-btn', { timeout: 12000 });

// ── open → focus should move into the dialog (close button) ──
await page.click('.cs-details-btn');
await page.waitForSelector('.cs-card-tabs', { timeout: 8000 });
await page.waitForTimeout(350);
const openFocus = await activeClass();
check('focus moves to close button on open', openFocus.includes('cs-card-close'), `active="${openFocus}"`);

// ── focus trap: Tab / Shift+Tab stay inside the dialog and wrap at the ends ──
const inCard = () => page.evaluate(() => {
  const root = document.querySelector('.cs-card-float');
  return !!(root && document.activeElement && root.contains(document.activeElement));
});
let escaped = false;
for (let i = 0; i < 10; i += 1) { await page.keyboard.press('Tab'); await page.waitForTimeout(35); if (!(await inCard())) { escaped = true; break; } }
check('Tab stays inside dialog', !escaped);
escaped = false;
for (let i = 0; i < 10; i += 1) { await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(35); if (!(await inCard())) { escaped = true; break; } }
check('Shift+Tab stays inside dialog', !escaped);

const FOCUS_SEL = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';
await page.evaluate((sel) => {
  const root = document.querySelector('.cs-card-float');
  window.__f = Array.from(root.querySelectorAll(sel)).filter((el) => el.getClientRects().length > 0);
  window.__f[window.__f.length - 1].focus();
}, FOCUS_SEL);
await page.keyboard.press('Tab'); await page.waitForTimeout(50);
check('Tab from last wraps to first', await page.evaluate(() => document.activeElement === window.__f[0]));
await page.evaluate(() => { window.__f[0].focus(); });
await page.keyboard.press('Shift+Tab'); await page.waitForTimeout(50);
check('Shift+Tab from first wraps to last', await page.evaluate(() => document.activeElement === window.__f[window.__f.length - 1]));

// ── switch to Gallery tab ──
const galleryTab = await page.evaluate(() => {
  const b = Array.from(document.querySelectorAll('.cs-card-tabs .cs-tab')).find((x) => (x.textContent || '').toLowerCase().startsWith('gallery'));
  const r = b.getBoundingClientRect();
  return { x: r.x + r.width / 2, y: r.y + r.height / 2 };
});
await page.mouse.click(galleryTab.x, galleryTab.y);
await page.waitForSelector('.cs-gallery-stage', { timeout: 8000 });
await page.waitForTimeout(300);

const stage = await page.evaluate(() => {
  const s = document.querySelector('.cs-gallery-stage').getBoundingClientRect();
  return { x: s.x, y: s.y, w: s.width, h: s.height };
});
const rightX = stage.x + stage.w * (5 / 6);
const leftX = stage.x + stage.w * (1 / 6);
const midX = stage.x + stage.w / 2;
const midY = stage.y + stage.h / 2;

let c = await count();
await page.mouse.click(rightX, midY); await page.waitForTimeout(250);
let n = await count(); check('click right-third → next', n === c + 1, `${c}→${n}`); c = n;

await page.mouse.click(leftX, midY); await page.waitForTimeout(250);
n = await count(); check('click left-third → prev', n === c - 1, `${c}→${n}`); c = n;

await page.keyboard.press('ArrowRight'); await page.waitForTimeout(250);
n = await count(); check('ArrowRight → next', n === c + 1, `${c}→${n}`); c = n;

// ── WHEEL nav (delta 60 > the 48 threshold → one advance); wait past the 240ms lock ──
await page.mouse.move(midX, midY); await page.waitForTimeout(120);
await page.mouse.wheel(0, 60); await page.waitForTimeout(320);
n = await count(); check('wheel down → next', n === c + 1, `${c}→${n}`); c = n;

// ── close (Escape) → focus should return to the trigger ──
await page.keyboard.press('Escape');
await page.waitForTimeout(350);
const closeFocus = await activeClass();
check('focus restores to trigger on close', closeFocus.includes('cs-details-btn'), `active="${closeFocus}"`);

await browser.close();

for (const r of rows) console.log(`   ${r.ok ? '✓' : '✗'} ${r.name.padEnd(38)} ${r.detail}`);
const fails = rows.filter((r) => !r.ok).length;
console.log(`\ncard interactions: ${rows.length - fails}/${rows.length} ok`);
process.exit(fails ? 1 : 0);
