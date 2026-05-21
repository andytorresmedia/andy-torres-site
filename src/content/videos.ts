// videos.ts — maps project ids → Mux playback IDs.
//
// Every id is `null` until the masters are uploaded to Mux. When an id is null
// the case-study player falls back to the bundled local mp4 (`project.video`),
// so the page works end-to-end today. Once you paste a real PUBLIC playback ID,
// the player switches to Mux HLS automatically: adaptive bitrate, a real quality
// menu, and no poster-flash.
//
// TODO(mux): Mux dashboard → upload master → Assets → copy the *public* Playback
// ID → paste below. Keep playback policy = "public" (or wire signed tokens).

export const REEL_MUX_PLAYBACK_ID: string | null = null; // optional: homepage hero reel via Mux

export const PROJECT_MUX_PLAYBACK_IDS: Record<string, string | null> = {
  rockets: null,
  sblx: null,
  mextour: null,
  hrf1: null,
  finalfour: null,
  'nba-finals': null,
  'sb-lvii-open': null,
  'ring-reveal': null,
  'clippers-s24': null,
  trojans: null,
  'chargers-open': null,
  nuggets: null,
  mavs: null,
  'hawks-inverted': null,
  'nets-open': null,
  mahomes: null,
  'fc-cincy': null,
  'suns-playoffs': null,
};

/** Playback ID for a project, or null to use the local mp4 fallback. */
export function getMuxPlaybackId(projectId: string): string | null {
  return PROJECT_MUX_PLAYBACK_IDS[projectId] ?? null;
}
