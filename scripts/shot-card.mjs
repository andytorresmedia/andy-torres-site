// scripts/shot-card.mjs - open the case-study "project file" slab, screenshot it,
// and verify the interaction paths that have regressed during the 3D-card work.
//   node scripts/shot-card.mjs [baseURL]   (default http://localhost:4173)

import { chromium } from 'playwright';
import { mkdirSync, existsSync } from 'node:fs';

const BASE = process.argv[2] || 'http://localhost:4173';
const OUT = 'verify-shots';
mkdirSync(OUT, { recursive: true });

const CACHED_CHROME =
  process.env.PLAYWRIGHT_CHROME ||
  (process.env.HOME
    ? `${process.env.HOME}/.cache/ms-playwright/chromium_headless_shell-1217/chrome-headless-shell-linux64/chrome-headless-shell`
    : '');

const browser = await chromium.launch({
  executablePath: CACHED_CHROME && existsSync(CACHED_CHROME) ? CACHED_CHROME : undefined,
  args: ['--autoplay-policy=no-user-gesture-required'],
});
const errors = [];
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2 });
const page = await ctx.newPage();
page.on('console', (m) => { if (m.type() === 'error') errors.push(m.text()); });
page.on('pageerror', (e) => errors.push('PAGEERROR: ' + (e && e.message)));

await page.goto(BASE + '/work/rockets', { waitUntil: 'domcontentloaded', timeout: 30000 });
await page.waitForTimeout(2600); // loading screen (1400ms) + settle

const navResult = { navChildrenClickable: false, searchOpens: false };
try {
  navResult.navChildrenClickable = await page.locator('.nav > *').evaluateAll((els) =>
    els.length > 0 && els.every((el) => getComputedStyle(el).pointerEvents !== 'none'),
  );
  await page.getByRole('button', { name: 'Open search' }).click({ timeout: 5000 });
  await page.waitForTimeout(250);
  navResult.searchOpens = await page.locator('.cmdk').isVisible();
  await page.locator('.cmdk-scrim').click({ position: { x: 5, y: 5 }, timeout: 5000 });
  await page.locator('.cmdk').waitFor({ state: 'hidden', timeout: 5000 });
} catch (e) {
  errors.push('NAV: ' + e.message);
}

await page.locator('.cs-details-btn').click({ timeout: 8000 }).catch((e) => errors.push('OPEN: ' + e.message));
await page.waitForTimeout(1300); // entrance + light sweep
await page.screenshot({ path: `${OUT}/slab-rest.png` }); // straight-facing at rest

// CLICK RELIABILITY: click each tab by its word; confirm the tab's content renders.
const checks = [['Gallery', '.cs-gallery'], ['R&D', '.cs-rd-grid'], ['About', '.cs-about-row']];
const cursorResult = { nativeBodyCursor: false, customDotHidden: false };
const tabResult = {};
const galleryResult = {
  progressRemoved: false,
  wheelChangedFrame: false,
  edgeWheelChangedFrame: false,
  centerClickIgnored: false,
  sideClickChangedFrame: false,
  thumbChangedFrame: false,
};
const contentResult = { aboutWheelScrollsFromTitle: false };
for (const [name, sel] of checks) {
  try {
    if (!cursorResult.nativeBodyCursor) {
      cursorResult.nativeBodyCursor = await page.evaluate(() => getComputedStyle(document.body).cursor !== 'none');
      cursorResult.customDotHidden = await page.locator('.cursor').evaluateAll((els) =>
        els.length === 0 || els.every((el) => getComputedStyle(el).display === 'none'),
      );
    }

    await page.locator('.cs-card-tabs .cs-tab', { hasText: name }).click({ timeout: 5000 });
    await page.waitForTimeout(450);
    tabResult[name] = await page.locator(sel).first().isVisible();
    if (name === 'Gallery') {
      galleryResult.progressRemoved = await page.locator('.cs-gallery-stage > .progress').count() === 0;
      const before = await page.locator('.cs-gallery-caption .count').first().innerText();
      await page.locator('.cs-gallery-stage').hover();
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(450);
      const after = await page.locator('.cs-gallery-caption .count').first().innerText();
      galleryResult.wheelChangedFrame = before !== after;

      const stageBox = await page.locator('.cs-gallery-stage').boundingBox({ timeout: 5000 });
      if (!stageBox) throw new Error('gallery stage has no bounding box');
      await page.mouse.move(stageBox.x + stageBox.width * 0.9, stageBox.y + stageBox.height * 0.35);
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(450);
      const afterEdgeWheel = await page.locator('.cs-gallery-caption .count').first().innerText();
      galleryResult.edgeWheelChangedFrame = afterEdgeWheel !== after;

      await page.mouse.click(stageBox.x + stageBox.width * 0.5, stageBox.y + stageBox.height * 0.44);
      await page.waitForTimeout(350);
      const afterCenterClick = await page.locator('.cs-gallery-caption .count').first().innerText();
      galleryResult.centerClickIgnored = afterCenterClick === afterEdgeWheel;

      const rightBox = await page.locator('.cs-gallery-half.right').boundingBox({ timeout: 5000 });
      if (!rightBox) throw new Error('gallery right hit zone has no bounding box');
      await page.mouse.click(rightBox.x + rightBox.width * 0.72, rightBox.y + rightBox.height / 2);
      await page.waitForTimeout(450);
      const afterSideClick = await page.locator('.cs-gallery-caption .count').first().innerText();
      galleryResult.sideClickChangedFrame = afterSideClick !== afterEdgeWheel;

      await page.locator('.cs-gallery-thumb').nth(3).click({ timeout: 5000 });
      await page.waitForTimeout(450);
      const activeThumb = await page.locator('.cs-gallery-thumb').evaluateAll((thumbs) =>
        thumbs.findIndex((thumb) => thumb.classList.contains('active')),
      );
      galleryResult.thumbChangedFrame = activeThumb === 3;
    }
    if (name === 'About') {
      const body = page.locator('.cs-card-body').first();
      await body.evaluate((el) => { el.scrollTop = 0; });
      await page.locator('.cs-card-title').hover();
      await page.mouse.wheel(0, 700);
      await page.waitForTimeout(250);
      contentResult.aboutWheelScrollsFromTitle = await body.evaluate((el) => el.scrollTop > 0);
    }
  } catch (e) {
    tabResult[name] = false;
    errors.push(`TAB ${name}: ` + e.message);
  }
}
await page.screenshot({ path: `${OUT}/slab-tabs.png` });

let closeXPass = false;
try {
  await page.locator('.cs-card').evaluate((el) => {
    el.style.transform = 'perspective(1600px) rotateX(9deg) rotateY(-18deg)';
  });
  await page.waitForTimeout(250);
  const closeBox = await page.locator('.cs-card-close').boundingBox({ timeout: 5000 });
  if (!closeBox) throw new Error('card close button has no bounding box');
  await page.mouse.click(closeBox.x + closeBox.width / 2, closeBox.y + closeBox.height / 2);
  await page.waitForTimeout(350);
  closeXPass = await page.locator('.cs-card').count() === 0;
  if (!closeXPass) errors.push('CLOSE X: card stayed open');
} catch (e) {
  errors.push('CLOSE X: ' + e.message);
}

if (closeXPass) {
  await page.locator('.cs-details-btn').click({ timeout: 8000 }).catch((e) => errors.push('REOPEN: ' + e.message));
  await page.locator('.cs-card').waitFor({ state: 'visible', timeout: 8000 }).catch((e) => errors.push('REOPEN WAIT: ' + e.message));
}

// Tilt to show the thickness on the edges.
// Force a representative tilt for the screenshot only: headless synthetic
// mousemove does not reliably drive React onMouseMove, but a real cursor does.
await page.locator('.cs-card').evaluate((el) => {
  el.style.transform = 'perspective(1600px) rotateX(9deg) rotateY(-18deg)';
});
await page.waitForTimeout(250);
await page.screenshot({ path: `${OUT}/slab-tilt.png` });

await browser.close();
const benign = /play\(\)|AbortError|NotAllowedError|favicon|ERR_|media resource|Autoplay/i;
const meaningful = errors.filter((e) => !benign.test(e));
const cursorPass = Object.values(cursorResult).every(Boolean);
const navPass = Object.values(navResult).every(Boolean);
const tabsPass = Object.values(tabResult).every(Boolean);
const galleryPass = Object.values(galleryResult).every(Boolean);
const contentPass = Object.values(contentResult).every(Boolean);
const overallPass = cursorPass && navPass && tabsPass && galleryPass && contentPass && closeXPass && meaningful.length === 0;

console.log('case route nav controls:', JSON.stringify(navResult), navPass ? 'PASS' : 'FAIL');
console.log('native cursor restored:', JSON.stringify(cursorResult), cursorPass ? 'PASS' : 'FAIL');
console.log('tab clicks open their content:', JSON.stringify(tabResult), tabsPass ? 'PASS' : 'FAIL');
console.log('gallery manual controls:', JSON.stringify(galleryResult), galleryPass ? 'PASS' : 'FAIL');
console.log('card content scrolling:', JSON.stringify(contentResult), contentPass ? 'PASS' : 'FAIL');
console.log('card close x:', closeXPass ? 'PASS' : 'FAIL');
console.log('console errors:', JSON.stringify(meaningful, null, 2));
console.log(overallPass ? 'PASS clean' : 'FAIL issues');
process.exit(overallPass ? 0 : 1);
