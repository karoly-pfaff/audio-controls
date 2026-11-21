import { mkdir, writeFile, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { resolve, dirname, basename } from 'node:path';
import { renderDocumentation } from './render-documentation.mjs';
import { bundleDocumentation } from './bundle-documentation.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const entry = resolve(root, 'docs/site/sources/main.tsx');
const output = resolve(root, 'docs/site/build');
const bundle = await bundleDocumentation(entry);

const html = renderDocumentation(root)
  .replace('/* DOCUMENTATION_STYLES */', () => bundle.style)
  .replace('/* DOCUMENTATION_SCRIPT */', () => bundle.script.replaceAll('</script', '<\\/script'));

if (dirname(output) !== resolve(root, 'docs/site') || basename(output) !== 'build')
  throw new Error('Documentation output must stay inside docs/site/build.');
await rm(output, { recursive: true, force: true });
await mkdir(output, { recursive: true });
await writeFile(resolve(output, 'index.html'), html);
await writeFile(resolve(output, '.nojekyll'), '');
console.log('GitHub Pages documentation: ' + resolve(output, 'index.html'));
