# FRONT ROW

**Cinematic 3D · VFX · Motion — for sports, entertainment, and live-event moments.**

The studio site: a work-first, full-bleed React app with a sticky scroll-video reel, per-project
case studies, and a contact-driven conversion flow. _("Front Row" is a working name; final
studio name / domain TBD.)_

> **AI assistants:** see [`CLAUDE.md`](./CLAUDE.md) for architecture and conventions.
> **Going live?** the remaining setup checklist is in [`HANDOFF.md`](./HANDOFF.md).

## Quickstart

```bash
npm install
npm start        # dev server (CRA; defaults to port 3000)
npm run build    # production build → build/
```

Verify a production build headlessly:

```bash
npm run build
node scripts/serve-build.mjs                            # serves build/ on :4173
node scripts/verify-routes.mjs http://localhost:4173    # loads every route, checks for console errors
```

## Stack

Create React App (react-scripts 5) · react-router-dom 6 · Framer Motion (`motion/react`) ·
Mux Player · cmdk + fuse.js (⌘K search) · Resend (contact form, via a Vercel serverless function).

TypeScript is used for the **content layer only** (`src/content/*.ts`); components are `.jsx`.

## Project structure

```
src/
  App.jsx            router + horizontal page-slide transition
  components/        Nav, Cursor, AIWall, CmdK, CTA, Footer
  sections/          HeroReel, StickySequence, HomeSections
  pages/             Home, Work, CaseStudy, About, Contact
  content/           projects.ts · videos.ts · site.ts   ← edit data here
  lib/               assets, navigation, pageScroll helpers
  styles/            ported design system + overrides.css
  _legacy/           previous site (kept for reference, not bundled)
api/contact.js       Vercel serverless → Resend
public/assets/       videos, project stills, client logos, AT mark
```

## Editing content

- **Projects** (Work list, homepage reel, case studies, search): `src/content/projects.ts`
- **Video** (Mux playback IDs; `null` = local mp4 fallback): `src/content/videos.ts`
- **Clients / services / press / contact strings**: `src/content/site.ts`

## Deploy

Target is **Vercel** (`vercel.json` — SPA rewrite + `/api` serverless functions):

```bash
vercel --prod
```

Set `RESEND_API_KEY` and `STUDIO_EMAIL` in the Vercel project first (see `HANDOFF.md`).

## Design

Locked visual language — port/extend, don't redesign: ink-black canvas, bone-white type, single
signal-orange accent (`#ff5b1f`); Anton display / Space Grotesk body / JetBrains Mono labels;
agentic UI grammar (dot-grid, corner brackets, mono coordinate readouts).
