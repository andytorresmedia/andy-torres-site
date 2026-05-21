// assets.ts — resolve a /public asset path to a URL that works under any
// PUBLIC_URL (root domain, gh-pages, or a Vercel subpath). Content files store
// paths like 'assets/proj-suns.jpg'; components call asset() before rendering.

const BASE = process.env.PUBLIC_URL || '';

export function asset(path?: string): string | undefined {
  if (!path) return undefined;
  if (/^(https?:)?\/\//.test(path) || path.startsWith('data:')) return path;
  return `${BASE}/${path.replace(/^\/+/, '')}`;
}
