# HANDOFF — what to do next

The FRONT ROW site is built and verified (clean production build, all routes load with zero
console errors). This is the checklist of work that requires *your* accounts, keys, media, and
decisions. Check items off as you go. (Project overview lives in `CLAUDE.md`.)

---

## 1. Contact form — Resend (so the form actually emails)

The form posts to `api/contact.js`. Until configured it "mock-succeeds" (shows the thank-you
state, sends nothing).

- [ ] Create a [Resend](https://resend.com) account + API key.
- [ ] In Vercel → Project → Settings → Environment Variables, add:
  - [ ] `RESEND_API_KEY` — your key
  - [ ] `STUDIO_EMAIL` — the inbox that should receive briefs
  - [ ] `CONTACT_FROM` *(optional)* — a verified sender like `Front Row <hello@yourdomain.com>`.
        Defaults to Resend's shared `onboarding@resend.dev` if omitted.
- [ ] Verify your sending domain in Resend (required to send from your own address).

## 2. Video — Mux (fixes poster-flash + enables real quality menu)

Case studies currently play the bundled local mp4. To use Mux:

- [ ] Create a [Mux](https://mux.com) account.
- [ ] For each project: **upload the master → open the Asset → copy its _public_ Playback ID**.
- [ ] Paste each ID into `src/content/videos.ts`, replacing the matching `null`
      (keys are the project `id`s, e.g. `rockets`, `sblx`). Optionally set `REEL_MUX_PLAYBACK_ID`
      to route the homepage hero through Mux too.
- [ ] (No code change needed — a non-null ID auto-switches that project to `<MuxPlayer>`.)

## 3. Content — projects & studio info

- [ ] Edit `src/content/projects.ts` — 18 projects are seeded; update titles, clients, tags,
      years, thumbnails, and case-study copy (summary/challenge/approach/deliverables/credits).
      The first 5 (`featured: true`) drive the homepage sticky sequence.
- [ ] Edit `src/content/site.ts` — client logos, services, press/recognition, `STUDIO_EMAIL`.
- [ ] Replace placeholder client phone/email in `site.ts` (`+1 (323) 000 — 0000`,
      `hello@frontrow.studio`).
- [ ] Update social links in `src/pages/ContactPage.jsx` (`SOCIALS` — currently generic
      instagram.com / vimeo.com / linkedin.com).
- [ ] *(Later, >~30 projects)* migrate `projects.ts` to Sanity or MDX — see the TODO in that file.

## 4. Domain + metadata

- [ ] Buy the domain and point it at Vercel.
- [ ] Update the hardcoded `andytorresfilms.com` in `public/sitemap.xml` and `public/robots.txt`.
- [ ] Update `homepage` in `package.json` to the final domain (or `/`).
- [ ] Replace the OG image: currently points at `assets/proj-suns.jpg` in `public/index.html`
      (`og:image` / `twitter:image`). Drop a designed **1200×630** card at `public/assets/og-image.png`
      and repoint both meta tags. (Favicon already uses the AT mark.)
- [ ] Update `<title>` / descriptions in `public/index.html` if the studio name changes.

## 5. Deploy

- [ ] `npm i -g vercel` (once), then from the repo root: **`vercel`** (preview) / **`vercel --prod`** (live).
- [ ] Config is in `vercel.json` (CRA framework, build → `build/`, SPA rewrite that excludes `/api/`).
- [ ] Set the env vars from §1 in the Vercel project before the prod deploy.
- Note: the repo still has the old gh-pages setup + `CNAME`. Vercel is the intended target;
  BrowserRouter deep-links need Vercel's rewrite (gh-pages would need a `404.html` hack).

## 6. Interactive QA (do this in a real browser — headless tests didn't exercise it)

The build + headless run verified routes load with no console errors, but these dynamic surfaces
need a human click-through:

- [ ] Custom cursor expands to the "View Project" pill over Work rows; hidden over form fields.
- [ ] Homepage sticky sequence: scroll through all 5 — letters smash in, white flash on switch,
      side-rail dots jump, accent progress bar tracks.
- [ ] ⌘K opens search, fuzzy results group by Pages/Projects/Services, Enter navigates.
- [ ] Case study: "Open Project File" reveals the graded card; 3D tilt follows the cursor;
      About / Gallery (arrow keys) / R&D tabs work.
- [ ] Page-slide transition + browser back/forward between routes.
- [ ] Submit the contact form against a deployed build (with §1 configured) and confirm the email.

## 7. Cleanup (optional, when comfortable)

- [ ] `ATMG Website/` — the original prototype source (reference only; safe to delete once happy).
- [ ] `src/_legacy/` — the old andytorresfilms.com site (kept for reference; not bundled).
- [ ] `verify-shots/` — screenshots from the headless verification.
- [ ] Consider `.gitignore`-ing `verify-shots/` and `build/` if not already.

---

### Performance note
LCP won't hit < 2.5s while the hero is a 16MB local mp4. Moving videos to Mux (§2) is the real fix;
the hero is already lazy-loaded after first paint to limit the damage.
