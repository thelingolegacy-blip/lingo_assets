import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const errors = [];
for (const file of ['index.html', 'vercel.json']) {
  if (!fs.existsSync(path.join(root, file))) errors.push(`${file}: missing`);
}
if (fs.existsSync(path.join(root, 'sitemap.xml'))) {
  const text = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
  if (!text.includes('<urlset')) errors.push('sitemap.xml: missing urlset');
}
console.log(JSON.stringify({ ok: errors.length === 0, errors }, null, 2));
if (errors.length) process.exit(1);
