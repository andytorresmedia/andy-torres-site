// scripts/probe-card-tabs.mjs — TEMPORARY investigation probe (safe to delete).
// Settles one question empirically: when a user clicks where a case-study card tab
// visually is — through the 3D tilt — does the CORRECT tab activate, on both mouse
// and touch? The card hand-rolls capture-phase coordinate routing for tabs
// (CaseStudyPage.jsx:800-818) using layout-space offsetLeft mixed with screen-space
// clientX; this checks whether that actually mis-selects in headless Chromium.
//
//   node scripts/probe-card-tabs.mjs [baseURL]    (default http://localhost:4173)

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

const TAB_LABELS = ['about', 'gallery', 'rd']; // CARD_TABS order

async function openCard(page) {
  await page.goto(BASE + '/work/rockets', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.waitForSelector('.cs-details-btn', { timeout: 12000 }); // after the fake loading delay
  await page.click('.cs-details-btn');
  await page.waitForSelector('.cs-card-tabs', { timeout: 8000 });
  await page.waitForTimeout(400);
}

// Returns the active tab label by matching the active button's text to TAB_LABELS.
async function activeTab(page) {
  return page.evaluate(() => {
    const el = document.querySelector('.cs-card-tabs .cs-tab.active');
    if (!el) return null;
    const t = (el.textContent || '').toLowerCase();
    if (t.startsWith('about')) return 'about';
    if (t.startsWith('gallery')) return 'gallery';
    if (t.startsWith('r')) return 'rd';
    return t.trim();
  });
}

// Geometry of each tab button, measured at rest (no pointer over the card).
async function tabBoxes(page) {
  return page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.cs-card-tabs .cs-tab'));
    return tabs.map((b) => {
      const r = b.getBoundingClientRect();
      return { x: r.x, y: r.y, w: r.width, h: r.height, cx: r.x + r.width / 2, cy: r.y + r.height / 2 };
    });
  });
}

async function run(mode) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    hasTouch: mode === 'touch',
    isMobile: false,
  });
  const page = await ctx.newPage();
  const rows = [];
  try {
    await openCard(page);
    const boxes = await tabBoxes(page);

    // Build click targets: each tab center, plus points just inside each tab edge
    // (stresses the index rounding / boundary of the coordinate math).
    const targets = [];
    boxes.forEach((b, i) => {
      targets.push({ expect: TAB_LABELS[i], label: `${TAB_LABELS[i]}@center`, x: b.cx, y: b.cy });
      targets.push({ expect: TAB_LABELS[i], label: `${TAB_LABELS[i]}@left+6`, x: b.x + 6, y: b.cy });
      targets.push({ expect: TAB_LABELS[i], label: `${TAB_LABELS[i]}@right-6`, x: b.x + b.w - 6, y: b.cy });
    });

    for (const t of targets) {
      // Reset to a known tab first so each probe is independent.
      await page.evaluate(() => {
        const about = Array.from(document.querySelectorAll('.cs-card-tabs .cs-tab')).find((b) =>
          (b.textContent || '').toLowerCase().startsWith('about'));
        about && about.click();
      });
      await page.waitForTimeout(120);

      if (mode === 'touch') await page.touchscreen.tap(t.x, t.y);
      else await page.mouse.click(t.x, t.y);
      await page.waitForTimeout(160);

      const got = await activeTab(page);
      rows.push({ probe: t.label, at: `${Math.round(t.x)},${Math.round(t.y)}`, expect: t.expect, got, ok: got === t.expect });
    }
  } catch (e) {
    rows.push({ probe: 'ERROR', error: e.message });
  } finally {
    await ctx.close();
  }
  return rows;
}

const mouse = await run('mouse');
const touch = await run('touch');
await browser.close();

const fmt = (rows) => rows.map((r) => (r.error ? `   ⚠ ${r.error}` : `   ${r.ok ? '✓' : '✗'} ${r.probe.padEnd(16)} @${r.at.padEnd(9)} expect=${r.expect} got=${r.got}`)).join('\n');
const fails = (rows) => rows.filter((r) => r.ok === false || r.error).length;

console.log('── MOUSE ──');
console.log(fmt(mouse));
console.log('── TOUCH ──');
console.log(fmt(touch));
console.log(`\nmouse mismatches: ${fails(mouse)} / ${mouse.length}`);
console.log(`touch mismatches: ${fails(touch)} / ${touch.length}`);
process.exit(0);
