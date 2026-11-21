import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertCandidateMetadata,
  assertCandidateDigest,
  candidateFilename,
  candidateDigest,
} from './candidate-report.mjs';
import { packageFileIssues, stylesheetImports } from './package-files.mjs';

const MANIFEST = { name: '@karoly-pfaff/audio-controls', version: '0.1.0' };

const FILES = [
  'package.json',
  'README.md',
  'LICENSE',
  'CHANGELOG.md',
  'build/index.js',
  'build/index.d.ts',
  'build/timeline/index.js',
  'build/timeline/index.d.ts',
  'build/styles.css',
];

test('checks the scoped candidate identity and actual archive bytes', () => {
  const bytes = Buffer.from('candidate archive');
  const report = {
    ...MANIFEST,
    filename: candidateFilename(MANIFEST),
    sha256: candidateDigest(bytes),
  };
  assert.doesNotThrow(() => {
    assertCandidateMetadata(report, MANIFEST);
  });
  assert.doesNotThrow(() => {
    assertCandidateDigest(report, bytes);
  });
  assert.throws(() => {
    assertCandidateDigest(report, Buffer.from('tampered archive'));
  });
  assert.throws(() => {
    assertCandidateMetadata({ ...report, version: '1.0.0' }, MANIFEST);
  });
  assert.throws(() => {
    assertCandidateMetadata({ ...report, filename: '../escape.tgz' }, MANIFEST);
  });
});

test('keeps tests, credentials and authored source out while requiring public and legal assets', () => {
  assert.deepEqual(packageFileIssues([...FILES, 'build/themes/palettes.css']), []);
  for (const path of [
    '.npmrc',
    'sources/index.ts',
    'build/../.env',
    'build/foo.test.js',
    'build/.env',
    'NOTICE',
    'THIRD_PARTY_NOTICES',
  ]) {
    assert(packageFileIssues([...FILES, path]).some((issue) => issue.includes(path)));
  }
  assert(packageFileIssues(FILES.filter((file) => file !== 'LICENSE')).length > 0);
});

test('keeps stylesheet imports relative and inside the published build tree', () => {
  assert.deepEqual(stylesheetImports('build/styles.css', "@import './themes/palettes.css';"), [
    'build/themes/palettes.css',
  ]);
  assert.throws(() => {
    stylesheetImports('build/styles.css', "@import 'https://example.com/styles.css';");
  });
  assert.throws(() => {
    stylesheetImports('build/styles.css', "@import './../../private.css';");
  });
});
