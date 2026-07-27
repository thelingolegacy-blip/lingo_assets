import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
const warn = [];
const rel = file => path.relative(root, file).replaceAll(path.sep, '/');
function walk(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap(entry => {
    if (entry.name === '.git' || entry.name === 'node_modules') return [];
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walk(full) : [full];
  });
}
const files = walk(root);
const htmlFiles = files.filter(file => file.endsWith('.html'));
if (!htmlFiles.length) errors.push('No HTML files found for static deployment.');
for (const file of ['vercel.json']) {
  if (!fs.existsSync(path.join(root, file))) warn.push(`${file}: missing`);
}
for (const file of htmlFiles) {
  const text = fs.readFileSync(file, 'utf8');
  const name = rel(file);
  if (!/<title>[^<]+<\/title>/i.test(text)) errors.push(`${name}: missing title`);
  if (!/<meta\s+name=["']description["']/i.test(text)) warn.push(`${name}: missing description meta`);
  for (const match of text.matchAll(/href=["']#([^"']+)["']/g)) {
    const id = match[1];
    if (!new RegExp(`id=["']${id.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}["']`).test(text)) {
      errors.push(`${name}: unresolved hash link #${id}`);
    }
  }
}
const sitemap = path.join(root, 'sitemap.xml');
if (fs.existsSync(sitemap)) {
  const text = fs.readFileSync(sitemap, 'utf8');
  const sitemapRoutes = new Set();
  let sitemapOrigin = '';
  for (const match of text.matchAll(/<loc>(.*?)<\/loc>/g)) {
    try {
      const url = new URL(match[1]);
      sitemapOrigin ||= url.origin;
      sitemapRoutes.add(url.pathname);
    } catch {
      errors.push(`sitemap.xml: invalid loc ${match[1]}`);
    }
  }
  for (const file of htmlFiles) {
    if (path.basename(file) !== 'index.html') continue;
    const routePath = rel(file).replace(/(^|\/)index\.html$/, '$1');
    const route = routePath ? `/${routePath}` : '/';
    if (!sitemapRoutes.has(route)) errors.push(`sitemap.xml: missing route ${sitemapOrigin}${route}`);
  }
}
console.log(JSON.stringify({ htmlFileCount: htmlFiles.length, errors, warn }, null, 2));
if (errors.length) process.exit(1);
