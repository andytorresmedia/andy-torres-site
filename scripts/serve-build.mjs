// scripts/serve-build.mjs — minimal dependency-free static server for build/,
// with SPA fallback to index.html (mirrors Vercel's rewrite). For local verify.
//   PORT=4173 node scripts/serve-build.mjs

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';

const ROOT = join(process.cwd(), 'build');
const PORT = process.env.PORT || 4173;
const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.mp4': 'video/mp4', '.ico': 'image/x-icon', '.txt': 'text/plain', '.xml': 'application/xml',
  '.woff2': 'font/woff2', '.woff': 'font/woff', '.map': 'application/json',
};

async function tryFile(p) {
  try {
    const s = await stat(p);
    if (s.isFile()) return p;
  } catch (_e) {
    /* not a file */
  }
  return null;
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    const filePath = normalize(join(ROOT, urlPath));
    if (!filePath.startsWith(ROOT)) {
      res.writeHead(403);
      return res.end('forbidden');
    }
    let resolved = await tryFile(filePath);
    // SPA fallback: extension-less path with no matching file → index.html
    if (!resolved && !extname(urlPath)) resolved = join(ROOT, 'index.html');
    if (!resolved) {
      res.writeHead(404);
      return res.end('not found');
    }
    const data = await readFile(resolved);
    res.writeHead(200, { 'Content-Type': MIME[extname(resolved)] || 'application/octet-stream' });
    return res.end(data);
  } catch (e) {
    res.writeHead(500);
    return res.end('error: ' + e.message);
  }
});

server.listen(PORT, () => console.log(`serving build/ at http://localhost:${PORT}`));
