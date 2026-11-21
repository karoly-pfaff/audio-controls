export const PACKAGE_NAME = '@karoly-pfaff/audio-controls';
export const REPOSITORY = 'karoly-pfaff/audio-controls';
export const REGISTRY = 'https://npm.pkg.github.com';

export function assertReleaseIdentity(manifest) {
  const requirements = [
    [manifest.name === PACKAGE_NAME, 'Unexpected scoped package name.'],
    [manifest.license === 'MIT', 'Release license must be MIT.'],
    [manifest.publishConfig?.registry === REGISTRY, 'Registry must be GitHub Packages.'],
    [
      manifest.repository?.url === 'git+https://github.com/' + REPOSITORY + '.git',
      'Repository metadata does not match the release target.',
    ],
    [manifest.private !== true, 'The package manifest is marked private.'],
  ];
  for (const [valid, message] of requirements) {
    if (!valid) throw new Error(message);
  }
}

export function assertReleaseVersion(manifest, expected) {
  if (!/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)$/.test(manifest.version))
    throw new Error('This first-release workflow requires a stable x.y.z version.');
  if (manifest.version !== expected)
    throw new Error('Requested version does not match package.json.');
}

export function assertPublishContext(manifest, context) {
  assertReleaseIdentity(manifest);
  assertReleaseVersion(manifest, context.RELEASE_VERSION);
  if (context.GITHUB_ACTIONS !== 'true' || context.PUBLISH_REQUESTED !== 'true')
    throw new Error('Publication requires an explicit GitHub Actions publish dispatch.');
  if (context.GITHUB_REPOSITORY !== REPOSITORY)
    throw new Error('Publication must run in the owning repository.');
  if (context.GITHUB_REF !== 'refs/tags/audio-controls-v' + manifest.version)
    throw new Error('Publication must run from the matching version tag.');
}
