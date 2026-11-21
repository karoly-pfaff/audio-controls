# GitHub Packages

## Package configuration

- Repository: https://github.com/karoly-pfaff/audio-controls-react.
- Package: @karoly-pfaff/audio-controls-react on https://npm.pkg.github.com.
- Visibility: public repository and package, configured separately in GitHub settings.
- License: MIT, provided by the root LICENSE.

The manual publishing workflow accepts stable version tags matching package.json. The commands
below use 0.1.0 as the release version; use the version being released for later publications.

## Local candidate

Use Node 24.18.1 and npm 11.16.0, as configured in the workflows.

```sh
npm ci
npm run package:check
npm run check
npm run docs:build
npm run release:check
```

Run package:check first on a fresh checkout. Typed lint includes the independent React 19 fixture
under tests/integration/react19-consumer;
that fixture needs an installed tarball. The command builds, packs and validates the actual archive,
checks the complete CSS import graph, then installs it into the fixture. React 19 TypeScript checks
run with skipLibCheck=false and negative type contracts; SSR needs no browser audio globals.
Fixture dependency versions stay exact; its lockfile is intentionally refreshed for the new local
archive bytes. The archive is generated from this checkout rather than checked into Git.

The versioned archive is artifacts/karoly-pfaff-audio-controls-react-0.1.0.tgz. A stable local copy
at artifacts/audio-controls-react.tgz lets the fixture work with later package versions without a
manifest rewrite. artifacts/package-report.json records the actual file list, SHA-256, npm integrity
and workflow commit (null for local candidates). The report and archives are ignored generated output.

Allowed package contents are compiled build/ JavaScript, declarations and CSS plus package.json,
README, CHANGELOG and LICENSE. Tests, authored sources, credentials,
workflows and documentation build tools do not belong in the registry archive. CSS relative imports
must remain inside build/ and every dependency must be packed.

## Repository setup

Create the public repository and upload the reviewed source.
The CI verification job uses contents:read and does not publish packages.
It runs the candidate consumer, strict serial quality/coverage, documentation and release checks,
then retains the tarball/report/HTML as a workflow artifact. Checks use one test worker.
A successful main run also uploads docs/site/build and deploys the documentation to GitHub Pages;
configure its Actions publishing source before the first main upload. See [Pages setup](github-pages.md).

Create a github-packages environment before the first publish dispatch. Configure its required
reviewer and version-tag deployment rules if desired. A referenced environment name alone does
not create protection rules; GitHub plan availability also affects those rules. Configure repository
and registry package visibility separately.

The publishing workflow uses the repository GITHUB_TOKEN, with contents:read and packages:write.
Only its final publish step receives NODE_AUTH_TOKEN. No long-lived publishing PAT or npmjs token
is required in repository secrets. Checkout does not persist credentials. The committed .npmrc
routes only @karoly-pfaff to GitHub Packages; other dependency scopes keep their normal registry.

## Dry run and publication

1. Upload the reviewed commit and run Library quality.
2. Run GitHub Packages candidate manually with version=0.1.0 and publish=false. Review its candidate
   report, consumer results, coverage and offline HTML artifact. This mode performs no publish.
3. Create the version tag v0.1.0 on the exact reviewed release commit.
4. Select that tag in the manual workflow dispatch, set version=0.1.0 and publish=true.
5. The job repeats the checks and publishes the exact validated tarball with latest after checking
   its digest and build commit. Branch dispatches, mismatched tags/versions, other repositories and
   local direct publishing are rejected by release guards.
6. In GitHub package settings, verify the repository association and explicitly make the package
   public. GitHub documents private visibility as the first-publication default. Package visibility
   is a separate post-publication setting; npm's access flag is not used as a substitute.
7. Install the published exact version in a consumer and verify its imports and stylesheet.

Version numbers are immutable once published. The workflow accepts stable x.y.z releases;
introduce an explicit prerelease/dist-tag policy before using beta versions. Do not overwrite an
existing release version or silently replace the tagged artifact. Plain local npm publish is guarded;
release:publish additionally requires the exact workflow/tag context, token and candidate commit.

## Consumer installation and migration

GitHub's npm registry requires authentication even for public packages. On a developer machine,
use npm login with a personal access token (classic) that has read:packages. Keep the token in
your user credential configuration, never commit it or paste it into project files/chat.

```sh
npm login --scope=@karoly-pfaff --auth-type=legacy --registry=https://npm.pkg.github.com
npm config set @karoly-pfaff:registry=https://npm.pkg.github.com --location=project
npm install --save-exact @karoly-pfaff/audio-controls-react@0.1.0
```

Import the scoped root, /timeline and /styles.css entries. Consumers that use unscoped import
strings can use an npm alias after publication:

```sh
npm install --save-exact audio-controls-react@npm:@karoly-pfaff/audio-controls-react@0.1.0
```

An alias preserves imports such as audio-controls-react/timeline while locking the scoped registry
version. Deliberately replace the old vendor/file dependency and update that host's lockfile; then
run its targeted integration/accessibility checks.
For consumer GitHub Actions, use packages:read and NODE_AUTH_TOKEN with a registry mapping; grant
the consumer repository package access where required. Do not give installation jobs write access.

## Release validation

Local candidate checks validate the archive contents, declarations, CSS imports and consumer
integration. Verify GitHub credentials, environment protection, hosted CI, public visibility and
registry installation in the release workflow and package settings.

References:

- [GitHub npm registry](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry)
- [Node package publication workflows](https://docs.github.com/en/actions/tutorials/publish-packages/publish-nodejs-packages)
- [GitHub environments](https://docs.github.com/en/actions/how-tos/deploy/configure-and-manage-deployments/manage-environments)
- [npm publish](https://docs.npmjs.com/cli/v11/commands/npm-publish/)
