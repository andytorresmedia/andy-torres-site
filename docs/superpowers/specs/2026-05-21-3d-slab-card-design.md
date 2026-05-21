# 3D "Graded Slab" Case-Study Card — Design

**Date:** 2026-05-21 · **Branch:** `experiment/3d-card` · **Baseline to revert to:** tag `baseline-v1`

## Context

The `/work/:slug` "Open Project File" card currently reads as a flat plane that tilts
(`src/pages/CaseStudyPage.jsx` + `src/styles/case-study.css`). The owner wants it to feel
like a **physical encased object** — a PSA/CGC-style graded trading card in a thin rigid
case: real visible thickness, polished beveled edge, glossy front, grounded shadow, premium.

## Decision

Build it with **CSS 3D (preserve-3d) + Motion springs** — the existing stack — *not* WebGL/Three.js.

### Why (the owner's constraints decided this)

Owner requirements: **maximum "wow," but keep the site smooth, and work on mobile with no
separate degraded version.** Those constraints rule *for* CSS:

- **Smoothness:** CSS 3D transforms/gradients/filters are GPU-composited natively — no engine
  download, no per-frame render loop. WebGL ships a 3D engine (hundreds of KB) and re-renders
  the scene behind the glass every frame for refraction (its most expensive feature).
- **Mobile, one codebase:** CSS slab runs identically on phones; tilt is driven by the
  **gyroscope** (a premium mobile delight), falling back to touch-drag + idle float. WebGL's
  refraction would force a stripped-down mobile variant — the exact thing to avoid.
- **Live content:** the card holds working tabs (About/Gallery/R&D) and a playing video. CSS
  keeps them real HTML — crisp, scrollable, clickable. WebGL would bake them to a texture or
  overlay them outside the glass.
- **Honest limit:** CSS can't do true light *refraction* or mirror reflections. On a near-black
  site there's no environment to reflect, so simulated highlights read as fully premium. The
  reference's "wow" is ~90% thickness + bevel + gloss + shadow — all native to CSS.

## Approach / Components

Transform the card into a **box with real depth**, not a single plane:

- **Thickness** — a back face at `translateZ(-DEPTH)` plus **four side walls** (top/right/
  bottom/left) rotated into 3D to connect front→back. When it turns you see a solid polished
  edge. `DEPTH ≈ 42px`.
- **Polished metal edge + beveled frame** — gunmetal/graphite gradients on the walls and a
  beveled frame on the front, with a specular hotspot that tracks `--mx/--my` as it tilts.
  *(Translated into the locked ink-black + orange palette — NOT literal silver, which would
  break the design system. See Palette note.)*
- **Glass top layer** — a `.cs-card-glass` overlay with a diagonal sheen that slides as it
  tilts + a one-time light-sweep on open + faint inner edge shadow (content sits recessed under
  glass). Kept subtle over text so it stays readable.
- **Grounded shadow** — a blurred dark ellipse beneath the slab so it reads as floating with
  weight.

## Motion

- **Resting 3/4 tilt** so it reads dimensional even at rest (not flat-on).
- **Idle float** — slow oscillation on a wrapper element (`.cs-card-float`) so it breathes;
  cursor/gyro tilt composes on top via the existing `useSpring` springs.
- **Entrance** — opacity fade with the backdrop (kept simple to avoid transform conflicts).

## Mobile

Same component. `deviceorientation` (gyro) drives the tilt; iOS permission requested on the
"Open Project File" tap. Fallback: touch-drag + idle float. No second version.
*(Implemented as the checkpoint right after the desktop look is approved; needs on-device test.)*

## Content

Stays 100% live and interactive — encased, never baked.

## Palette note

The reference is silver/white/blue; this site is locked to ink-black / bone / signal-orange.
We port the *dimensional qualities* (thickness, bevel, gloss, shadow, materiality) into the dark
palette as a gunmetal/graphite slab with the existing orange accents. If the owner explicitly
wants to break toward bright chrome for this one surface, that's a separate, deliberate call.

## Phase-2 (optional, only if pure-CSS isn't premium enough after review)

Bake the chrome/glass frame once in Blender/Spline as a high-detail PNG (normal/specular maps)
and layer it over the same CSS motion — more photoreal, still smooth, still one codebase.

## Acceptance

1. Card shows real, visible thickness (polished edge) when tilted.
2. Reads as a dimensional object at rest (resting tilt + idle float).
3. Glass sheen + grounded shadow present; premium, not busy.
4. All content stays live and interactive; text stays readable.
5. `CI=true npm run build` clean; no console errors; works in the slide-router shell.
6. (Next checkpoint) Gyro tilt on mobile, one codebase, graceful fallback.

## Out of scope (for now)

WebGL, a separate mobile build, recoloring the whole card to silver, changing other routes.
