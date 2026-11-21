import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { PACKAGE_ROOT, readManifest } from './run-npm.mjs';

export function candidateFilename(manifest) {
  return manifest.name.slice(1).replace('/', '-') + '-' + manifest.version + '.tgz';
}

export function candidateDigest(bytes) {
  return createHash('sha256').update(bytes).digest('hex');
}

export function assertCandidateMetadata(report, manifest) {
  if (report.name !== manifest.name || report.version !== manifest.version)
    throw new Error('Candidate name/version differs from package.json.');
  if (report.filename !== candidateFilename(manifest))
    throw new Error('Candidate filename does not match the scoped package.');
}

export function assertCandidateDigest(report, bytes) {
  if (report.sha256 !== candidateDigest(bytes))
    throw new Error('Candidate archive checksum mismatch.');
}

export function readCandidate() {
  const manifest = readManifest();
  const report = JSON.parse(
    readFileSync(resolve(PACKAGE_ROOT, 'artifacts/package-report.json'), 'utf8'),
  );
  assertCandidateMetadata(report, manifest);
  assertCandidateDigest(report, readFileSync(resolve(PACKAGE_ROOT, 'artifacts', report.filename)));
  return report;
}
