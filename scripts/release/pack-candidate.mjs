import { mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PACKAGE_ROOT, readManifest, runNpm } from './run-npm.mjs';
import { assertReleaseIdentity, assertReleaseVersion } from './release-contract.mjs';
import { inspectPackageFiles } from './package-files.mjs';
import { assertCandidateMetadata, candidateDigest } from './candidate-report.mjs';

const manifest = readManifest();

assertReleaseIdentity(manifest);
assertReleaseVersion(manifest, manifest.version);
mkdirSync(resolve(PACKAGE_ROOT, 'artifacts'), { recursive: true });

const [packed] = JSON.parse(
  runNpm(['pack', '--ignore-scripts', '--pack-destination', 'artifacts', '--json']),
);

assertCandidateMetadata(packed, manifest);
inspectPackageFiles(PACKAGE_ROOT, packed.files);

const bytes = readFileSync(resolve(PACKAGE_ROOT, 'artifacts', packed.filename));

const report = {
  ...packed,
  sha256: candidateDigest(bytes),
  sourceCommit: process.env.GITHUB_SHA ?? null,
};

writeFileSync(
  resolve(PACKAGE_ROOT, 'artifacts/package-report.json'),
  JSON.stringify(report, null, 2) + '\n',
);
copyFileSync(
  resolve(PACKAGE_ROOT, 'artifacts', packed.filename),
  resolve(PACKAGE_ROOT, 'artifacts/audio-controls.tgz'),
);
console.log('Validated candidate: ' + packed.filename + ' · SHA-256 ' + report.sha256);
