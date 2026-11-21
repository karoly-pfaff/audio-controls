# Code quality and verification

The package uses strictTypeChecked and stylisticTypeChecked ESLint presets,
SonarJS and structural limits, plus declaration-spacing, callable-naming and
component/effect boundary rules. [Coding standards](coding-standards.md) is mandatory.

## Serial acceptance gate

npm run check builds the library before checks resolve package declarations, then runs formatting,
code/duplicate/dead-code/layout lint, typecheck, tooling regressions and all-source coverage.
Use targeted commands while working; tests run serially with one worker. Never start benchmarks or
unrelated application gates to qualify this package.

The documentation site is included in strict typed lint, component/effect boundaries, Knip
and jscpd. Typecheck includes its own tsconfig. npm run docs:build emits the Pages-ready site from
typed demos and generated public API tables; see [documentation authoring](html-documentation.md).

| Command                 | Responsibility                                                                      |
| ----------------------- | ----------------------------------------------------------------------------------- |
| npm run build           | Clean owned generated build/ output, emit ESM/declarations and copy CSS             |
| npm run format:check    | Prettier formatting without modifications                                           |
| npm run lint:code       | Strict typed ESLint, SonarJS, structural/naming/component boundaries; zero warnings |
| npm run lint:duplicates | jscpd strict mode, four lines and 50 tokens, zero production/tooling duplication    |
| npm run lint:dead-code  | Knip unused files/exports/dependencies and stale hints                              |
| npm run lint:layout     | Every public control in its own named directory                                     |
| npm run typecheck       | Source, tests and tooling configuration under strict TypeScript                     |
| npm run test:tooling    | Colocated Node regressions for rules and layout validation                          |
| npm run test:coverage   | Every production source at 100% lines/statements/functions/branches per file        |

Coverage includes unimported production code. Only tests are excluded from the sources/ coverage
scope; shared test setup lives outside that directory. Types and public entry points are not hidden.
Do not add coverage ignore directives to production code. Tests target user-visible behavior,
boundaries, disabled/invalid/unavailable states and lifecycle cleanup, not mirrored implementation.

Knip entries must represent actual public exports, CLI scripts, test suites or integration consumers.
Do not add unused source as an entry or ignore dead exports. jscpd excludes tests and generated files,
not production UI. The packed-package consumer is an isolated integration test project.

Host applications test their own browser compatibility, rendering/export and release requirements.

## Package and integration checks

The custom declaration-spacing, callable-naming and component/effect rules have colocated
regression tests under scripts/lint. They have no runtime dependency on another repository.
The package uses its root MIT LICENSE.

On a fresh checkout, run npm run package:check before the serial gate to install the independent
React 19 tarball fixture. Candidate file/registry/version/context guards and their colocated tests
are part of tooling verification; see [release instructions](../release/github-packages.md).

jscpd.json is a root configuration; its source paths are relative to that root. Keep its zero
duplication threshold and existing source coverage. The independent React 19 test project lives in
tests/integration/react19-consumer. Root tsconfig excludes that fixture to avoid mixing the producer's
React 18 types with React 19; npm run typecheck explicitly checks its separate strict tsconfig, and
package:check installs the archive and runs its type/SSR/CSS checks. No library sources are excluded.
