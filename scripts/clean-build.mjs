import { rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, basename } from 'node:path';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = fileURLToPath(new URL('../build', import.meta.url));

if (dirname(output) !== root.slice(0, -1) || basename(output) !== 'build')
  throw new Error('Build output must stay inside this repository.');

await rm(output, { recursive: true, force: true });
