// projects.ts — Front Row project catalog.
//
// Single source of truth for the Work page, the homepage sticky sequence, case
// studies, and Cmd-K search. Asset paths are relative to /public (resolve them
// through `asset()` in src/lib/assets.ts before use).
//
// TODO(cms): When the catalog grows past ~30 projects, migrate this to Sanity
// (or MDX files under src/content/projects/*.mdx) and replace the static import
// with a generated/queried collection. Keep the `Project` type below as the
// contract so downstream components don't change. Until then, edit this file.

export type ProjectCategory = 'Sports' | 'Broadcast' | 'Brand';

export interface MediaItem {
  type: 'video' | 'image';
  src: string;
  poster?: string;
  caption?: string;
  tag?: string; // mono "channel" label on R&D tiles, e.g. 'CH.01 · LOOK-DEV'
}

export interface GalleryItem {
  src: string;
  caption: string;
}

export interface Credit {
  role: string;
  name: string;
}

export interface CaseStudyDetail {
  summary: string;
  challenge: string;
  approach: string;
  deliverables: string[];
}

export interface Project {
  /** url slug + stable id */
  id: string;
  /** zero-padded catalog index, e.g. '01' */
  num: string;
  title: string;
  client: string;
  category: ProjectCategory;
  tags: string[];
  year: string;
  /** poster/thumbnail path under /public */
  thumb: string;
  role?: string;

  // ── homepage sticky sequence ──
  featured?: boolean;
  featuredOrder?: number;
  /** sequence backdrop (defaults to `thumb`) */
  sequenceMedia?: string;
  sequenceType?: 'video' | 'image';
  sequencePoster?: string;
  /** short tag shown under the sequence title */
  sequenceTag?: string;

  // ── case study (optional; getProjectBySlug synthesizes sensible defaults) ──
  video?: string;
  poster?: string;
  about?: CaseStudyDetail;
  credits?: Credit[];
  gallery?: GalleryItem[];
  rd?: MediaItem[];
}

/** A project with all case-study fields guaranteed present. */
export interface ResolvedProject extends Project {
  video: string;
  poster: string;
  about: CaseStudyDetail;
  credits: Credit[];
  gallery: GalleryItem[];
  rd: MediaItem[];
}

// Shared defaults for case studies that don't ship bespoke media yet.
export const DEFAULT_GALLERY: GalleryItem[] = [
  { src: 'assets/proj-suns.jpg', caption: 'Final frame · arena pass' },
  { src: 'assets/proj-mahomes.jpg', caption: 'Look-dev · player isolation' },
  { src: 'assets/proj-ring-reveal.jpeg', caption: 'Concept · ring-reveal pass' },
  { src: 'assets/proj-chargers.jpeg', caption: 'BTS · arena install day' },
  { src: 'assets/proj-nuggets.jpeg', caption: 'Storyboard / treatment' },
  { src: 'assets/proj-mavs.jpg', caption: 'Color-grade reference' },
];

export const DEFAULT_RD: MediaItem[] = [
  { type: 'video', src: 'assets/loop-shiny.mp4', poster: 'assets/proj-suns.jpg', caption: 'Material R&D · chrome look-dev', tag: 'CH.01 · LOOK-DEV' },
  { type: 'video', src: 'assets/hero-reel.mp4', poster: 'assets/proj-superbowl.jpg', caption: 'Camera tests · arena sweep', tag: 'CH.02 · CAMERA' },
  { type: 'image', src: 'assets/proj-fccincy.jpg', caption: 'Houdini sim · particle burst', tag: 'CH.03 · SIM' },
  { type: 'image', src: 'assets/proj-hawks.png', caption: 'Unreal previs · LED screen', tag: 'CH.04 · PREVIS' },
];

export const PROJECTS: Project[] = [
  // ── Featured (homepage sticky sequence, in order) ──
  {
    id: 'rockets', num: '01', title: 'ROCKETS', client: 'Houston Rockets',
    category: 'Sports', tags: ['3D', 'Direction', 'Comp'], year: '2024',
    thumb: 'assets/proj-suns.jpg', role: 'Direction · 3D · Comp',
    featured: true, featuredOrder: 1,
    sequenceMedia: 'assets/proj-suns.jpg', sequenceType: 'image',
    sequenceTag: 'Playoff Show Open',
    video: 'assets/hero-reel.mp4', poster: 'assets/proj-suns.jpg',
    about: {
      summary: 'A pregame open built to feel like a punch in the chest — H-Town playoff energy, broadcast-ready, in two weeks.',
      challenge: 'Hit a live-air playoff slot with original 3D, custom typography, and an in-arena LED build. Two-week window, hard out.',
      approach: 'Built the entire show from boards through final in-house. Look-dev in Houdini, comp in Nuke, real-time previs in Unreal for the in-arena LED pass.',
      deliverables: ['Broadcast open (1×)', 'In-arena LED loop (3×)', 'Social cutdowns (5×)', 'Lower-thirds package'],
    },
    credits: [
      { role: 'Direction', name: 'Front Row Studio' },
      { role: 'Lead 3D', name: 'Front Row · Senior Bench' },
      { role: 'Comp / Finish', name: 'Front Row' },
      { role: 'Sound Design', name: 'External · Credited' },
      { role: 'Client Producer', name: 'Houston Rockets' },
    ],
  },
  {
    id: 'sblx', num: '02', title: 'SUPER BOWL LX', client: 'Van Wagner · NFL',
    category: 'Broadcast', tags: ['VFX', 'In-Venue', 'Animation'], year: '2026',
    thumb: 'assets/proj-superbowl.jpg', role: 'Lead VFX · Animation',
    featured: true, featuredOrder: 2,
    sequenceMedia: 'assets/proj-superbowl.jpg', sequenceType: 'image',
    sequenceTag: 'In-Venue Pregame',
    video: 'assets/hero-reel.mp4', poster: 'assets/proj-superbowl.jpg',
    about: {
      summary: 'The pregame moment for the biggest American sporting event of the year — engineered for the stadium ribbon, the IMAG screens, and a live TV cut, all conformed.',
      challenge: 'Single hero film, three delivery formats (broadcast, IMAG, stadium ribbon), one approval window, and a kickoff with no Plan B.',
      approach: 'Modular pipeline — one master at 8K, automated conform to each delivery aspect ratio. Senior comp bench scaled around the brief on a 4-week sprint.',
      deliverables: ['Pregame hero film (1×)', 'Stadium ribbon loop (1×)', 'IMAG cut (1×)', 'Broadcast cut (1×)', 'Social teaser (3×)'],
    },
    credits: [
      { role: 'Direction', name: 'Front Row Studio' },
      { role: 'Lead VFX', name: 'Front Row · Senior Bench' },
      { role: 'Comp Supervisor', name: 'Front Row' },
      { role: 'Color', name: 'External · Credited' },
      { role: 'Client', name: 'Van Wagner / NFL' },
    ],
  },
  {
    id: 'mextour', num: '03', title: 'MEXTOUR', client: 'Mexican National Team',
    category: 'Sports', tags: ['Identity', '3D', 'Design'], year: '2025',
    thumb: 'assets/proj-fccincy.jpg', role: 'Concept · Design · 3D',
    featured: true, featuredOrder: 3,
    sequenceMedia: 'assets/loop-shiny.mp4', sequenceType: 'video',
    sequencePoster: 'assets/proj-fccincy.jpg', sequenceTag: 'Tour Identity Film',
  },
  {
    id: 'hrf1', num: '04', title: 'HARD ROCK F1', client: 'Hard Rock · F1',
    category: 'Brand', tags: ['CGI', 'Comp', 'Finish'], year: '2025',
    thumb: 'assets/proj-clippers.jpg', role: 'CGI · Comp · Finishing',
    featured: true, featuredOrder: 4,
    sequenceMedia: 'assets/hero-reel.mp4', sequenceType: 'video',
    sequencePoster: 'assets/proj-clippers.jpg', sequenceTag: 'Miami GP Activation',
  },
  {
    id: 'finalfour', num: '05', title: 'FINAL FOUR', client: 'NCAA',
    category: 'Broadcast', tags: ['Design', 'Direction', 'VFX'], year: '2026',
    thumb: 'assets/proj-nba-finals.jpeg', role: 'Design · Direction · VFX',
    featured: true, featuredOrder: 5,
    sequenceMedia: 'assets/proj-nba-finals.jpeg', sequenceType: 'image',
    sequenceTag: 'Broadcast Open',
  },

  // ── Catalog ──
  { id: 'nba-finals', num: '06', title: 'NBA FINALS', client: 'NBA', category: 'Broadcast', tags: ['Show Open', '3D'], year: '2024', thumb: 'assets/proj-nba-finals.jpeg' },
  { id: 'sb-lvii-open', num: '07', title: 'SB LVII OPEN', client: 'CBS Sports', category: 'Broadcast', tags: ['VFX', 'Direction'], year: '2023', thumb: 'assets/proj-superbowl.jpg' },
  { id: 'ring-reveal', num: '08', title: 'RING REVEAL', client: 'Kansas City Chiefs', category: 'Sports', tags: ['CGI', 'Cinematic'], year: '2023', thumb: 'assets/proj-ring-reveal.jpeg' },
  { id: 'clippers-s24', num: '09', title: 'CLIPPERS S/24', client: 'LA Clippers', category: 'Sports', tags: ['Show Open', 'Animation'], year: '2024', thumb: 'assets/proj-clippers.jpg' },
  { id: 'trojans', num: '10', title: 'TROJANS', client: 'USC Football', category: 'Sports', tags: ['Show Open', '3D'], year: '2024', thumb: 'assets/proj-usc.jpeg' },
  { id: 'chargers-open', num: '11', title: 'CHARGERS OPEN', client: 'LA Chargers', category: 'Sports', tags: ['Cinematic', 'Comp'], year: '2024', thumb: 'assets/proj-chargers.jpeg' },
  { id: 'nuggets', num: '12', title: 'NUGGETS', client: 'Denver Nuggets', category: 'Sports', tags: ['Championship', '3D'], year: '2023', thumb: 'assets/proj-nuggets.jpeg' },
  { id: 'mavs', num: '13', title: 'MAVS', client: 'Dallas Mavericks', category: 'Sports', tags: ['Show Open'], year: '2024', thumb: 'assets/proj-mavs.jpg' },
  { id: 'hawks-inverted', num: '14', title: 'HAWKS INVERTED', client: 'Atlanta Hawks', category: 'Sports', tags: ['Concept', 'CGI'], year: '2024', thumb: 'assets/proj-hawks.png' },
  { id: 'nets-open', num: '15', title: 'NETS OPEN', client: 'Brooklyn Nets', category: 'Sports', tags: ['Show Open'], year: '2024', thumb: 'assets/proj-nets.jpeg' },
  { id: 'mahomes', num: '16', title: 'MAHOMES', client: 'Kansas City Chiefs', category: 'Sports', tags: ['Player Film', 'Cinematic'], year: '2024', thumb: 'assets/proj-mahomes.jpg' },
  { id: 'fc-cincy', num: '17', title: 'FC CINCY', client: 'FC Cincinnati', category: 'Sports', tags: ['Identity', 'CGI'], year: '2024', thumb: 'assets/proj-fccincy.jpg' },
  { id: 'suns-playoffs', num: '18', title: 'SUNS PLAYOFFS', client: 'Phoenix Suns', category: 'Sports', tags: ['Playoff Open', 'VFX'], year: '2024', thumb: 'assets/proj-suns.jpg' },
];

/** Featured projects for the homepage sticky sequence, in display order. */
export const FEATURED_PROJECTS: Project[] = PROJECTS
  .filter((p) => p.featured)
  .sort((a, b) => (a.featuredOrder ?? 99) - (b.featuredOrder ?? 99));

function synthesize(p: Project): ResolvedProject {
  const tagLower = (p.sequenceTag || p.tags[0] || '').toLowerCase();
  return {
    ...p,
    video: p.video || 'assets/hero-reel.mp4',
    poster: p.poster || p.thumb,
    about: p.about || {
      summary: `An on-air piece built for ${p.client}'s ${tagLower} — premium, on-deadline, and conformed for every delivery path.`,
      challenge: 'Original 3D, custom typography, and a live-air-ready master with a tight broadcast window.',
      approach: 'Studio-led from boards through final cut. Look-dev → 3D → comp → finish in-house. Senior bench scaled to the brief.',
      deliverables: ['Hero film', 'In-venue cut', 'Broadcast cut', 'Social cutdowns', 'Stills package'],
    },
    credits: p.credits || [
      { role: 'Direction', name: 'Front Row Studio' },
      { role: 'Lead 3D / VFX', name: 'Front Row · Senior Bench' },
      { role: 'Comp / Finish', name: 'Front Row' },
      { role: 'Client', name: p.client },
    ],
    gallery: p.gallery || DEFAULT_GALLERY,
    rd: p.rd || DEFAULT_RD,
  };
}

/** Look up a project by slug, with all case-study fields resolved. */
export function getProjectBySlug(slug: string): ResolvedProject | undefined {
  const p = PROJECTS.find((x) => x.id === slug);
  return p ? synthesize(p) : undefined;
}

/** Filter helper shared by the Work page and Cmd-K. */
export function matchesFilter(p: Project, filter: string): boolean {
  if (filter === 'All') return true;
  if (filter === 'VFX/Compositing') return p.tags.some((t) => /VFX|CGI|Comp/i.test(t));
  return p.category === filter;
}
