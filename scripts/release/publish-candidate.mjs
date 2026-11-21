import { resolve } from 'node:path';
import { readManifest, runNpm, PACKAGE_ROOT } from './run-npm.mjs';
import { assertPublishContext, REGISTRY } from './release-contract.mjs';
import { readCandidate } from './candidate-report.mjs';

assertPublishContext(readManifest(), process.env);
if (!process.env.NODE_AUTH_TOKEN) throw new Error('GitHub Packages authentication is unavailable.');

const candidate = readCandidate();

if (!process.env.GITHUB_SHA || candidate.sourceCommit !== process.env.GITHUB_SHA)
  throw new Error('Candidate was not built from this workflow commit.');

console.log(
  runNpm([
    'publish',
    resolve(PACKAGE_ROOT, 'artifacts', candidate.filename),
    '--ignore-scripts',
    '--registry',
    REGISTRY,
    '--tag',
    'latest',
  ]),
);
