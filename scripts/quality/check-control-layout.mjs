import { readFile } from 'node:fs/promises';
import { controlLayoutViolations } from './control-layout.mjs';

const entries = ['sources/index.ts', 'sources/timeline/index.ts'];

const reports = await Promise.all(
  entries.map(async (path) => ({ path, text: await readFile(path, 'utf8') })),
);

const violations = reports.flatMap(controlLayoutViolations);

if (violations.length > 0) throw new Error(violations.join('\n'));

console.log('Every public control has its own directory.');
