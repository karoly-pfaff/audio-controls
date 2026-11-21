# Audio Controls React contributor rules

Read [coding standards](docs/development/coding-standards.md),
[code quality](docs/development/code-quality.md), [architecture](docs/architecture.md) and
[repository layout](docs/development/repository-layout.md) before changing code or tooling.
[CLAUDE.md](CLAUDE.md) points to this same canonical contract.

## Package boundaries

This is an independent React library with React ^18.3.1 or ^19.0.0 as a peer dependency.
Keep application stores, audio engines, DSP, persistence, workers and services in their hosts.
Runtime imports must not create audio contexts, workers, global event listeners or network calls.
Keep public exports, existing host behavior, source-time semantics and package declarations stable.

## Mandatory source rules

- Use English identifiers and repository documentation, strict TypeScript, explicit units, readonly
  contracts, explicit public return types and type-only imports. Validate unknown boundary input;
  do not introduce any or unchecked casts to disguise missing validation.
- Authored code lives in sources/; generated output lives in build/. Each public control owns its
  own directory, including its component, props, hooks and colocated tests. No common controls
  collection is allowed. Share only cohesive value/geometry behavior through explicit imports.
- A production UI file defines at most one React component OR one effect, never both. Separate
  effect hooks; do not hide multiple effects or components behind wrappers.
- Preserve the structural limits: 200 nonblank/noncomment lines per file,
  40 per function, eight statements, cyclomatic complexity six, cognitive complexity eight,
  nesting depth two, three parameters and two nested callbacks. No nested ternaries.
- Enforce declaration-spacing, callable-naming and component/effect rules. Prefer
  concrete names, small cohesive modules and explicit failures. Do not duplicate production code.
- Unit tests sit beside the owning module with the same basename and .test.ts/.test.tsx/.test.mjs.
  Central tests/ holds shared setup or integration fixtures. Test exemptions cover only file size,
  function size and statement count; complexity, nesting and correctness remain enforced.
- Review directories above 12 direct files, including tests/configuration/assets, and record the
  counts and ownership reasons in docs/development/repository-layout.md.
- Preserve accessible names/values, keyboard/pointer parity, visible focus, reduced motion,
  forced colors and independent cleanup when multiple controls are mounted.

## Quality and coverage

npm run check is the serial acceptance gate: build, formatting, code lint, zero-duplication jscpd,
Knip dead-code/dependency checks, control layout validation, typecheck, tooling regressions and
all-source library coverage. Every executable production source file must reach 100% lines,
statements, functions AND branches. The coverage threshold is per file; a global average cannot
mask a shortfall. Include unimported production sources. Do not exclude sources, lower thresholds,
add broad lint/coverage/Knip/jscpd ignores, mark dead code as an entry, or discard tests to pass.

Fix the implementation and meaningful missing behavior tests when a gate fails. Source moves must
update all imports, package entry points, tools, tests and ownership documentation together.
Keep generated output out of Git. Inspect real tarballs and external consumers for packaging changes.
Preserve the root MIT LICENSE.

## Local workflow and resource limits

Use npm and preserve the root and React 19 consumer package-lock.json files. Keep unrelated work
and consumer repositories intact. Use codex/ branches and local Git; remote operations, repository
creation, publication and releases require explicit authorization. Squash integration requires
explicit approval.

Keep checks short and serial with one worker. Validate the affected library without starting host
applications, GPU, export or performance work. Report actual coverage and failures honestly in the
task response. A configured target is not a passed result.

## GitHub Packages

The package name is @karoly-pfaff/audio-controls-react, the registry is GitHub Packages and the
repository is karoly-pfaff/audio-controls-react. Repository and package visibility are configured
separately for public access. Keep registry credentials outside committed files.

On a fresh checkout, install dependencies with npm ci, then run checks in this order:

```sh
npm run package:check
npm run check
npm run docs:build
npm run release:check
```

package:check builds the archive and installs the independent React 19 consumer required by typed
lint. Publishing uses a manual tagged workflow and the validated tarball. Keep public metadata,
exports and archive contents aligned with [release instructions](docs/release/github-packages.md).

## Documentation ownership and Pages

The docs/ namespace contains the web application in docs/site with sources/, content/
and generated build/; engineering and release Markdown remains in docs/development and docs/release.
Keep ESLint, Knip, jscpd, TypeScript, docs build paths and workflow artifact paths aligned when
moving this code. The interactive examples belong in docs/site.
The main CI deploys its verified site artifact to GitHub Pages; PR runs only build previews.
Deployment requires the repository's Pages configuration.

Document the current API, behavior, structure, configuration and operational procedures. Do not
add dated work logs, conversation history, approval records or personal decision records.
Report executed checks and their limits in the task response.

## Root configuration and integration fixtures

jscpd.json lives at the repository root alongside the other tool configurations.
Keep tooling configuration at the root and interactive examples in docs/site.
The packed-package React 19 integration test lives in tests/integration/react19-consumer.
Keep its TypeScript/SSR/CSS checks and update archive-relative paths
when moving it. Root TypeScript excludes only this separately compiled test fixture; the typecheck
script must explicitly check its own strict project. Documentation examples stay in docs/site.
