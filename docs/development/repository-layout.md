# Repository layout

Count direct files, including tests, documentation, configuration and assets;
exclude dependencies, Git metadata, ignored artifacts and generated build/coverage output.
More than twelve direct files requires an ownership review rather than arbitrary splitting.

The repository root has 19 direct files: package.json and package-lock.json, two TypeScript
configurations, ESLint/Prettier/Vitest/Knip/jscpd configurations, four editor/Git/formatter ignore files,
AGENTS.md, CLAUDE.md, README.md, LICENSE, CHANGELOG.md and .npmrc.
This exception is retained because package
managers, tooling, contributors and legal consumers discover those files at the root by convention.

Every other authored directory has at most twelve direct files. All thirteen public controls have
their own kebab-case directory under sources/, including the timeline controls. Each owner keeps
its component, props, hooks and colocated tests; canvas-waveform/drawing groups canvas rendering.
Supporting JSX components stay within their owning control. Public controls are not grouped under
controls/, common/ or shared/.

Pure keyboard-input, value-formatting, waveform-model and timeline/model responsibilities may be
used by multiple controls through explicit imports. The root and timeline index files define real
package entries, not an internal forwarding layer. tests/ contains shared setup/canvas fixtures and
the public-API integration test. scripts/lint owns the copied rules and their colocated regressions;
scripts/quality owns the control-layout validator and its tests. jscpd.json lives at the root
beside the other tool configurations.
The React 19 packed-package integration fixture lives in tests/integration/react19-consumer,
with its own manifest, lockfile and strict TypeScript program. Interactive documentation examples
are owned by docs/site.

The web documentation application lives in docs/site. Its sources/demos directory
groups examples by control; composition owns the complete timeline example. HTML chapters are
grouped under content/controls, content/timeline, content/guides and content/reference. Navigation,
synthetic fixtures, presentation and build generation have distinct owners. Generated offline HTML
lives in docs/site/build for GitHub Pages. All new directories remain below the review trigger.

Update this review when directory ownership changes. npm run lint:layout enforces the public
control-to-directory naming contract; the twelve-file review remains a documented agent duty.

sources/themes contains four cohesive CSS files: palettes, buttons, inputs and timeline
presentation. They share no component implementations. The web documentation has a themes demo directory
with ten direct source files for scoped preview, settings and color/size inputs; all remain below
the twelve-file review trigger. Generated build/themes CSS is package output.

Publication uses eleven cohesive release modules/tests under scripts/release,
two workflows under .github/workflows, and release guides under docs/release.
.npmrc stays at the root for npm scope discovery; legal/changelog files accompany the archive.
The root count includes package-lock.json, which is maintained by npm.

Git excludes installed dependencies, generated build/coverage/candidate output, disposable caches,
local browser captures/test reports, private .local/ records, environment settings and npm/editor/OS
temporary files. Environment templates named .env.example, .env.sample or .env.template remain
versionable. Keep both package-lock.json files, the token-free .npmrc, authored documentation,
workflow files and integration fixtures in Git. Do not hide sources with blanket output, log or
editor-directory rules. The Pages build artifact is uploaded by CI rather than committed.
