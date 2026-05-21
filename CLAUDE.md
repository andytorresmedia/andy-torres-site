# CLAUDE.md

Context for AI assistants working in this repo. Keep it concise and current.

## What this is

**FRONT ROW** — a cinematic 3D / VFX / motion studio site (premium broadcast / sports /
entertainment positioning). It's a single-page React app rebuilt from a locked design
prototype. "FRONT ROW" is a working studio name; final name/domain TBD.

Goal of the site: a **sales asset** that converts credibility into project inquiries —
the contact form is the primary conversion. See `HANDOFF.md` for remaining setup and
`../PRD.md` (private, not in repo) for positioning.

## Stack

- **Create React App** (react-scripts 5) — JS app with TypeScript **content files only**.
- **react-router-dom 6** — routes `/`, `/work`, `/work/:slug`, `/about`, `/contact`.
- **motion** (`motion/react`, the rebranded Framer Motion) — page transitions, scroll, springs.
- **@mux/mux-player-react** — case-study video (HLS adaptive). **cmdk** + **fuse.js** — ⌘K search.
- **clsx**, **lucide-react**. Serverless: **resend** (in `api/contact.js`, not bundled).

## Commands

```bash
npm start          # dev server (needs a free port; CRA defaults to 3000)
npm run build      # production build → build/
CI=true npm run build   # build that FAILS on any lint warning (use before shipping)

# Headless smoke test (Playwright): build first, then:
node scripts/serve-build.mjs        # serves build/ on :4173 with SPA fallback
node scripts/verify-routes.mjs http://localhost:4173   # loads every route, checks console errors + screenshots
```

## Architecture

- **Page transition** (`src/App.jsx`): `BrowserRouter` + `AnimatePresence`. Each route is an
  absolutely-positioned `.fr-page` panel that slides in from the right / out to the left.
- **Scroll is locked on `<body>`** (`src/styles/pages.css`); only the active `.fr-page` scrolls.
  Therefore scroll-driven UI (the homepage sticky sequence) reads the panel's scroll via
  `useScroll({ container })`, getting the panel ref from `PageScrollContext` (`src/lib/pageScroll.js`).
  **Do not** switch the sequence to window scroll — it will read nothing.
- **Custom cursor** (`src/components/Cursor.jsx`): native cursor hidden app-wide
  (`src/styles/overrides.css`); elements opt into variants with `data-cursor="view|link|drag"`
  + `data-cursor-label`.
- **Nav / Cursor / CmdK** render outside the sliding stage (persist across routes).

## Where things live

```
src/
  App.jsx                 # router + slide shell
  components/             # Nav, Cursor, AIWall, CmdK, CTA, Footer
  sections/               # HeroReel, StickySequence, HomeSections (Clients/Press/Services)
  pages/                  # HomePage, WorkPage, CaseStudyPage, AboutPage, ContactPage
  content/                # *** edit data here ***
    projects.ts           #   typed Project[] (18 seeded) — Work + sequence + case studies + search
    videos.ts             #   project id -> Mux playback ID (null = local mp4 fallback)
    site.ts               #   clients, services, press, contact strings
  lib/                    # assets.ts (asset() path helper), navigation.js, pageScroll.js
  styles/                 # ported prototype CSS (verbatim) + overrides.css (last; wins cascade)
  _legacy/                # OLD andytorresfilms.com site — kept for reference, NOT bundled, excluded from tsconfig
api/contact.js            # Vercel serverless function → Resend
public/assets/            # videos, project stills, client logos, AT mark
ATMG Website/             # the original prototype source (reference only; untracked)
```

## Conventions

- Components are `.jsx` (no `import React` needed — automatic JSX runtime). Data/config is `.ts`.
- Reference public assets by relative path in content (`assets/foo.jpg`) and resolve with
  `asset()` from `src/lib/assets.ts` before passing to `src`/`url()`.
- Navigate with `useNav()` / `useProjectOpener()` (`src/lib/navigation.js`), not raw `<a href>`.
- Design is **locked** — port/extend, don't redesign. Tokens in `src/styles/styles.css :root`
  (ink-black, bone, signal-orange `#ff5b1f`; Anton / Space Grotesk / JetBrains Mono).

## Gotchas (these cost real time)

- **TypeScript is pinned to 4.9.5.** react-scripts 5 breaks on TS 6. Don't upgrade it. React
  types pinned to `^18.3`.
- **Deploy target is Vercel** (`vercel.json`: SPA rewrite excluding `/api/`). Deep links need
  that rewrite. The repo also still has gh-pages config + a `CNAME` from the old site.
- **Case-study video** uses `<MuxPlayer>` only when `videos.ts` has a playback ID; otherwise it
  falls back to the local mp4 with the custom HUD controls. Both work.
- **LCP**: the hero `assets/hero-reel.mp4` is ~16MB (lazy-loaded after paint). LCP < 2.5s won't
  hold until videos move to Mux.
- The 3D case-study card tilt is hand-rolled with `motion` `useSpring` (not react-tilt) to keep
  the CSS `preserve-3d` / `translateZ` layering.

## Next steps / remaining setup

See **`HANDOFF.md`** — env vars, Mux uploads, domain, content, deploy command, and the
interactive QA checklist (the dynamic UI that headless tests don't exercise).
