import assert from 'node:assert/strict';
import test from 'node:test';
import {
  assertReleaseIdentity,
  assertReleaseVersion,
  assertPublishContext,
  PACKAGE_NAME,
  REGISTRY,
  REPOSITORY,
} from './release-contract.mjs';

const MANIFEST = {
  name: PACKAGE_NAME,
  version: '0.1.0',
  license: 'MIT',
  repository: { url: 'git+https://github.com/' + REPOSITORY + '.git' },
  publishConfig: { registry: REGISTRY },
};

const CONTEXT = {
  GITHUB_ACTIONS: 'true',
  PUBLISH_REQUESTED: 'true',
  RELEASE_VERSION: '0.1.0',
  GITHUB_REPOSITORY: REPOSITORY,
  GITHUB_REF: 'refs/tags/v0.1.0',
};

test('accepts the chosen scoped MIT package and exact tagged dispatch', () => {
  assert.doesNotThrow(() => {
    assertReleaseIdentity(MANIFEST);
  });
  assert.doesNotThrow(() => {
    assertReleaseVersion(MANIFEST, '0.1.0');
  });
  assert.doesNotThrow(() => {
    assertPublishContext(MANIFEST, CONTEXT);
  });
});

test('rejects changed registry, scope, license, repository and private flag', () => {
  for (const override of [
    { name: 'audio-controls-react' },
    { license: 'ISC' },
    { repository: {} },
    { publishConfig: {} },
    { private: true },
  ])
    assert.throws(() => {
      assertReleaseIdentity({ ...MANIFEST, ...override });
    });
});

test('rejects stale versions and prereleases from the stable release workflow', () => {
  assert.throws(() => {
    assertReleaseVersion(MANIFEST, '0.2.0');
  });
  assert.throws(() => {
    assertReleaseVersion({ ...MANIFEST, version: '0.1.0-beta.1' }, '0.1.0-beta.1');
  });
});

test('rejects local, dry-run, foreign-repository, branch and mismatched-tag publication', () => {
  for (const override of [
    { GITHUB_ACTIONS: 'false' },
    { PUBLISH_REQUESTED: 'false' },
    { GITHUB_REPOSITORY: 'other/repo' },
    { GITHUB_REF: 'refs/heads/main' },
    { GITHUB_REF: 'refs/tags/v0.2.0' },
    { RELEASE_VERSION: '0.2.0' },
  ])
    assert.throws(() => {
      assertPublishContext(MANIFEST, { ...CONTEXT, ...override });
    });
});
