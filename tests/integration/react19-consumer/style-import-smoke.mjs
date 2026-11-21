import { readFileSync } from 'node:fs';
import { strict as assert } from 'node:assert';

const entry = new URL(import.meta.resolve('@karoly-pfaff/audio-controls/styles.css'));
const root = new URL('./', entry);
const visited = new Set();

function inspectStylesheet(url) {
  if (visited.has(url.href)) return;
  assert(url.href.startsWith(root.href), 'CSS imports must stay inside the installed build.');
  const source = readFileSync(url, 'utf8');
  visited.add(url.href);
  for (const [, dependency] of source.matchAll(/@import\s+['"]([^'"]+)['"]/g)) {
    inspectStylesheet(new URL(dependency, url));
  }
}

inspectStylesheet(entry);
console.log('Installed stylesheet import graph passed (' + String(visited.size) + ' CSS files).');
