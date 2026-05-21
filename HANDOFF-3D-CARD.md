# 3D Case-Study Card — Handoff

Continuation notes for picking up the experimental 3D "graded-slab" case-study card.
(General project context is in `CLAUDE.md`; deploy/setup is in `HANDOFF.md`.)

## TL;DR — current state

- All work is on branch **`experiment/3d-card`**. `main` is the untouched, known-good site.
- The card is the panel that appears when you click **"Open Project File"** on a case study (`/work/:slug`).
- Two design directions exist, both saved as git tags. The owner is **deciding between A and B**:
  - **A — chrome case** *(current HEAD)*: the card is a polished chrome *case* with the dark
    content recessed inside it (matches the owner's reference: a chrome VIP-badge in a clear case).
  - **B — dark slab** *(tag `slab-v1`)*: restrained, cinematic dark slab with a polished edge.
- Latest commit `ed43780` is a performance/cursor pass on A (see gotcha #4).

## Restore points (git tags on the branch)

| Tag | What |
|---|---|
| `baseline-v1` | Full working site, before any 3D-card work |
| `slab-v1` | Direction **B** (dark slab) — straight-facing, clickable |
| `slab-v2-chrome` | Direction **A** (chrome case), first version |
| HEAD (`ed43780`) | A + the fluidity/cursor performance pass |

Revert anytime with `git reset --hard <tag>`. Bail to the original site with `git checkout main`.

## Architecture (CSS 3D, no WebGL)

- **Files:** `src/pages/CaseStudyPage.jsx` (route + card + tilt), `src/styles/case-study.css`
  (all card CSS), `src/components/Cursor.jsx` + `src/styles/cursor.css` (custom cursor),
  `src/styles/overrides.css` (loads last, wins the cascade).
- `.cs-card` is the chrome **frame** (`transform-style: preserve-3d`). It tilts via a
  Framer-Motion (`motion/react`) transform `perspective(1600px) rotateX/rotateY`, driven by
  `useSpring` off `rxRaw/ryRaw` motion values set in `onCardMouseMove`.
- Real **thickness** = four `.slab-wall` elements (chrome gradient) extruded back to `.cs-card-back`.
- Content lives in **`.cs-card-inset`** — a recessed dark panel with `overflow:hidden` (so it
  renders flat → reliable clicks). Tabs: About / Gallery / R&D.
- Decoration: `.cs-card::before` (static chrome highlight) and `.cs-card-glass` (static sheen).
  `.cs-card-spec` (cursor-following radial glow) and `.cs-card-holo` were **removed** in the perf pass.

## Gotchas — do NOT regress these (each cost real debugging time)

1. **Perspective goes in the `transform` function** (`perspective(1600px) …`), not the CSS
   `perspective` property — the property didn't apply through the backdrop-filtered `.cs-card-wrap`.
2. **Interactive content must be flat** (`translateZ(0)`, inside the `overflow:hidden` inset).
   Popping buttons forward in 3D offsets their click hit-area under perspective → unclickable tabs.
3. **No constant/idle animation on the card.** A perpetually-moving card makes its own buttons
   impossible to click (the target drifts; Playwright reports "element is not stable"). An earlier
   idle "float" was removed for exactly this.
4. **Don't repaint every mouse-move on big displays.** On the owner's **6K @ 175% scale** monitor,
   the jank came from per-frame full repaints: the cursor's `mix-blend-mode:difference`, and card
   glow layers updating via `--mx/--my` each move. Fix kept: tilt is a cheap GPU transform; all
   glow/sheen is **static**. Keep it that way.
5. **Custom cursor:** native cursor is hidden app-wide; `overrides.css` forces
   `cursor:none !important` on buttons/links (hover devices only) so the native hand doesn't
   flicker over the custom dot.
6. TypeScript is pinned to **4.9.5** (CRA react-scripts 5). Don't upgrade. Motion is `motion/react`.

## Owner's taste (captured from feedback)

- Card **faces straight at the camera at rest** — tilt only while hovering.
- Hover tilt must be **smooth, fluid, gentle** like the original flat card (NOT jumpy). Current:
  spring `{stiffness:140, damping:16, mass:0.6}`, magnitude ~±8° (`(x-0.5)*16`, `(0.5-y)*14`).
- Wants a **premium "encased object"** feel (PSA/Pokémon graded-slab in a clear case).
- Tabs must be **easy to click**.
- Test target: **6K monitor, 175% Windows display scale, Chrome zoom 100%.**

## How to verify

```bash
CI=true npm run build                              # must compile clean (fails on warnings)
node scripts/serve-build.mjs                       # serves build/ at http://localhost:4173
node scripts/shot-card.mjs http://localhost:4173   # opens card, ASSERTS all 3 tabs click-open,
                                                   # writes screenshots to verify-shots/
```
Owner views live at `http://localhost:4173/work/rockets` → "Open Project File".
Note: Playwright's synthetic mousemove does **not** drive the React tilt headlessly; `shot-card.mjs`
forces a representative tilt for the still. Real cursors tilt it live.

## Next steps (priority order)

1. **Owner decides A vs B.** If B: `git reset --hard slab-v1` (or cherry-pick the perf/cursor
   commit `ed43780` onto it — those fixes are direction-agnostic).
2. **Owner verifies the perf/cursor pass live** on 6K @ 175%: (a) hover is fluid, (b) no native
   cursor flicker over tabs, (c) tabs reliably clickable.
3. **If tabs are still hard to click at 175%** (the likely remaining risk): neutralize the tilt
   while the cursor is over interactive content. In `onCardMouseMove`, if
   `e.target.closest('.cs-card-inset')` is hit, ease `rxRaw/ryRaw` toward REST (0) instead of
   following the cursor — keeps clicks pixel-accurate while still tilting over the frame/edges.
   *(Designed but not implemented — was waiting on the owner's live test.)*
4. **Mobile / gyro tilt** (promised, not started): drive the tilt from `deviceorientation` on
   touch devices (request iOS permission on the "Open Project File" tap), fall back to touch-drag,
   one codebase / no separate mobile version. Needs on-device testing.
5. **Chrome finish tuning** if the owner wants it (bright silver ↔ darker gunmetal): the `.cs-card`
   background gradient + `.slab-wall` gradient in `case-study.css`.

## Design spec

`docs/superpowers/specs/2026-05-21-3d-slab-card-design.md`
