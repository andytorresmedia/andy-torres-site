// site.ts — non-project site content: clients, services, press, contact details.
// Logo paths resolve through asset() (src/lib/assets.ts) before rendering.

/** Public-facing studio address (shown in CTA / footer / mailto). The contact
 *  form's delivery target is set separately via the server STUDIO_EMAIL env var
 *  consumed by /api/contact.js. */
export const STUDIO_EMAIL = 'hello@frontrow.studio';
export const STUDIO_PHONE = '+1 (323) 000 — 0000';
export const STUDIO_LOCATION = 'Los Angeles, CA';

/** Budget ranges offered in the contact form's <select>. Intentionally mirrored by
 *  ALLOWED_BUDGETS in api/contact.js (src/ and api/ can't share a module) — edit both,
 *  identically, or the server will reject valid submissions. */
export const BUDGETS = ['Under $10K', '$10K – $25K', '$25K – $50K', '$50K – $100K', '$100K+', 'Not sure yet — let\'s talk'] as const;

/** "How did you hear about us?" options — an optional attribution field on the contact
 *  form, captured purely as studio data. Unlike BUDGETS this is NOT allowlisted by
 *  api/contact.js (the server just length-caps + escapes whatever arrives), so this
 *  list can change freely without touching the serverless function. */
export const HOW_HEARD = ['Referral / word of mouth', 'Google / search', 'Instagram', 'LinkedIn', 'Vimeo', 'Saw your work / reel', 'Event / conference', 'Other'] as const;

export interface ClientLogo {
  name: string;
  src?: string;
  label?: string;
}

export const CLIENTS: ClientLogo[] = [
  { name: 'NBA', src: 'assets/logos/nba.png' },
  { name: 'Super Bowl LVII', src: 'assets/logos/superbowl.png' },
  { name: 'Kansas City Chiefs', src: 'assets/logos/chiefs.png' },
  { name: 'LA Clippers', src: 'assets/logos/clippers.png' },
  { name: 'Phoenix Suns', src: 'assets/logos/suns.png' },
  { name: 'USC', src: 'assets/logos/usc.png' },
  { name: 'Atlanta Hawks', src: 'assets/logos/hawks.png' },
  { name: 'UFC', src: 'assets/logos/ufc.png' },
  { name: 'CBS Sports', src: 'assets/logos/cbs.png' },
  { name: 'EA Sports', src: 'assets/logos/ea.png' },
  { name: 'Adidas', src: 'assets/logos/adidas.png' },
  { name: 'Puma', src: 'assets/logos/puma.png' },
  { name: 'Under Armour', src: 'assets/logos/underarmour.png' },
  { name: 'Coinbase', src: 'assets/logos/coinbase.png' },
  { name: 'Rolling Loud', src: 'assets/logos/rollingloud.png' },
  { name: 'And more', label: '+ 40 more' },
];

export interface Service {
  num: string;
  name: string;
  desc: string;
}

export const SERVICES: Service[] = [
  { num: '01', name: 'Sports Teams & Leagues', desc: 'Show opens, intro packages, ring reveals, ticket-feature films, social cutdowns. Pipeline built for the broadcast clock — we hit air dates.' },
  { num: '02', name: 'Broadcast & Live Events', desc: 'On-air promos, in-venue jumbotron content, halftime films, championship opens. Conformed to spec, ready for the truck.' },
  { num: '03', name: 'Agencies & Production', desc: 'Senior-bench VFX and 3D for agency campaigns. Comp, CGI, finishing — we slot into your team and ship.' },
  { num: '04', name: 'Entertainment & Music', desc: 'Tour visuals, album rollouts, artist activations, festival opens. Cinematic motion that holds up on the IMAG screen.' },
  { num: '05', name: 'Immersive & In-Venue', desc: 'LED volume content, projection, jumbotron, lobby installs. Designed for the room, calibrated for the panel.' },
];

export interface Award {
  title: string;
  client: string;
  year: string;
}

export const AWARDS_PROJECTS: Award[] = [
  { title: 'NBA Finals', client: 'NBA', year: '2023' },
  { title: 'Super Bowl LVII', client: 'CBS / NFL', year: '2023' },
  { title: 'NFL Films', client: 'NFL Films', year: '2024' },
];

export const WORK_FILTERS = ['All', 'Sports', 'Broadcast', 'Brand', 'VFX/Compositing'] as const;
export type WorkFilter = (typeof WORK_FILTERS)[number];
