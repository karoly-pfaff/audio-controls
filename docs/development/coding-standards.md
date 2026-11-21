# Coding standards

These rules govern production code, scripts and applicable fixtures. The
[quality gate](code-quality.md) defines the automated checks.

## Understandability

Names and signatures must explain what a module does and how. Passing tools does not establish
readability. Read top-level operations as a sequence of named steps, each one level of detail lower.
Extract a function only when its responsibility has a useful name; do not fragment code to evade limits.

Use the same word for the same concept. Prefer concrete nouns such as `validationIssues`,
`pendingTasks` and `resolvedPreferences` to vague `data`, `info`, `item`, `manager` or `util`.
Generic contract vocabulary is appropriate when it actually names the abstraction.
Include units and identities: `timeoutMs`, `byteLength`, `relativePath`, `absolutePath`.
Names explain what; comments explain why and non-obvious invariants. Remove commented-out code.

## Naming

- Review directories with more than 12 direct files and organize them by actual responsibility.
  Twelve is a review trigger, not a hard maximum; document retained larger directories in the
  [repository layout guide](repository-layout.md). Count colocated tests and non-code assets too.
- Application and package source directories are named `sources/`; generated output directories
  are named `build/`. Update manifests, entry points, tests and tooling together when moving files.
- All files under `scripts/` use kebab-case, including modules containing classes, such as
  `check-package.mjs` and `source-boundary-check.mjs`. Class identifiers remain PascalCase.
  Elsewhere, a primary class file uses its exact PascalCase name, such as `MixerRuntime.ts`.
  Function modules and fixtures use camelCase, such as `eventChannel.ts`.
  React component files use PascalCase. Tests retain `.test.ts`, `.test.mjs` or `.spec.ts`; conventional `index.ts` and configuration filenames stay conventional.
  Documentation/data filenames may use kebab-case.
- Unit tests live in the same directory as the module under test and share its basename:
  `frameTime.ts` / `frameTime.test.ts`, `callable-naming.mjs` / `callable-naming.test.mjs`.
  Split unit suites by the module they test instead of collecting unrelated modules in one test file.
  Reserve central `tests/` directories for integration, E2E, benchmark tests and shared fixtures.
- Classes, types and interfaces use PascalCase without an `I` prefix. Functions and variables use
  camelCase; module-level constants use UPPER_SNAKE_CASE.
- Name actions and effects precisely: `validateConfiguration`, `writePreferences`,
  `cancelPendingTasks`. A pure derivation may use a descriptive noun phrase.
- Distinguish factories from effects: `createPreferenceError` constructs an error,
  `createPreferenceFailure` constructs a failure result. Reserve `throw`, `report` and `reject`
  for those actual operations; `error(...)` is ambiguous.
- Predicates read as questions: `isDisposed`, `hasPendingTasks`, `canStart`.
  An action returning a success flag uses `tryVerbSubject`. A Result-returning lifecycle check is
  `validateOperationState`, not a disguised predicate.
- Validators that accumulate findings say so: `addIssue`, `validateObjectFields`.
  Test factories and helpers also name their subject: `createMixerHarness`, `unwrapSuccess`.
- Short receiver-scoped names such as `storage.read`, `resource.dispose` and `mixer.play` are
  legitimate contracts. Standard data fields and platform getters keep their actual names.
- Preserve stable public props, error codes, npm commands and export subpaths when renaming
  internal files. Update imports, emitted references and documentation together. Public error codes
  use lower-case kebab-case, such as `invalid-argument`.

The `readable/callable-naming` rule rejects known ambiguous callable names in declarations,
expressions, methods, callback fields and directly typed interface signatures. Explicit boolean
returns and type guards need predicate names; assertion signatures are not boolean predicates.
Data fields such as `Result.error` are unaffected. There is no automatic naming fix. Inferred,
aliased and computed callables still need semantic review.

## Naming review

Before finishing, inspect changed signatures, bodies and call sites:

- Can a reader identify each factory result, validator subject, predicate and unit?
- Do names disclose mutation, notification, persistence, thrown errors and resource disposal?
- Are short names justified by an explicit receiver or generic contract?
- Are changed public names reflected in examples and compatibility notes?

Review concrete corrections and justified retained vocabulary alongside the implementation.
A test count, lint success or additional denylist entry cannot replace this review.

## Formatting and spacing

Use single quotes, semicolons, trailing commas, 100-column print width, two spaces, UTF-8,
LF line endings and a final newline. Prettier owns token layout; ESLint's
`readable/declaration-spacing` requires declaration/class-member separators.

Use one blank line between independent interfaces, aliases, classes, functions and multiline
constants, and between imports and declarations. Keep consecutive imports/re-exports and related
short constants together. Separate methods/accessors/constructors from each other and from data
fields; related properties may remain grouped.

Inside functions, separate validation, preparation, effects and return phases when useful. Keep
short guard groups together. Do not insert a blank after every statement. Keep comments attached
to declarations, avoid extra blanks just inside braces, and never remove useful spacing to meet limits.
Generated output, dependencies, lockfiles and ignored private records are outside public formatting
checks. Scripts rewriting authored files must preserve these conventions.

## Structural limits

| Measure                                 | Maximum |
| --------------------------------------- | ------: |
| Nonblank, noncomment lines per file     |     200 |
| Nonblank, noncomment lines per function |      40 |
| Statements per function                 |       8 |
| Cyclomatic complexity                   |       6 |
| Cognitive complexity                    |       8 |
| Nesting depth                           |       2 |
| Parameters                              |       3 |
| Nested callbacks                        |       2 |

Logical operators and conditional expressions count toward complexity. Test files are exempt only
from file/function size and statement limits; their complexity and correctness still matter.
Use early returns, never nested ternaries, and a cohesive readonly options object for more than
three values. Do not conceal unrelated responsibilities in an unstructured parameter bag.

## TypeScript and module design

Keep `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, unused-code checks and
`erasableSyntaxOnly`. Accept unknown input as `unknown` and validate it; never introduce `any`
or an unchecked assertion to disguise missing validation. A necessary assertion needs an invariant.
Declare public return types, use `import type` and handle discriminated unions exhaustively.

Prefer readonly public properties/arrays and new return values over mutating caller data. Keep
internal mutation locally owned. Prefer `Map` for external-string lookups; object DTOs need
own-property checks and safe construction. Source-relative imports use `.ts` or `.tsx`; the compiler rewrites
build extensions. Follow [module boundaries](../architecture.md) for cross-module imports.
Do not export internals merely to enable tests or silence dead-code tooling.

Use the simplest abstraction needed now. Share code when it represents the same concept;
accidental textual similarity is not a reason to couple modules. Keep pure decisions separate
from I/O and inject platform capabilities explicitly.

## Effects and failures

### Control and effect organization

Each production UI source file defines at most one React component OR one effect.
A file must never contain both. Count `useEffect`, `useLayoutEffect`
and `useInsertionEffect` together, including aliased calls. Render helpers must not conceal a
second component. Give components PascalCase files and cohesive synchronization hooks their own
camelCase files; do not hide several effects in a custom wrapper to evade the limit. Prefer pure
derived values and event handlers when synchronization with an external system is unnecessary.

Reuse shared controls, field layout, validation and domain operations. Render repeated settings
from typed descriptors through shared components rather than copying markup or handlers into
each panel. Keep extensions explicit and typed; an untyped generic form engine is unnecessary.
The `readable/studio-file-boundaries` lint rule checks components, wrappers and effect calls,
including React effect aliases. Review component/effect ownership alongside the existing hook and
duplication checks. An imported synchronization hook may be called by a component; the effect
definition lives in its own file. Pure supporting modules may contain neither.

Every public control owns its own directory under sources/. Keep its component, props, hooks, models and colocated tests together. Do not collect control implementations under controls/, shared/, or common/. Domain-specific value formatting and timeline/waveform models may be shared by explicit imports. sources/index.ts and sources/timeline/index.ts are the documented package API entries; do not add internal forwarding barrels.
Do not recreate a flat component or utility catch-all or add barrels
merely to hide paths. Reuse the existing controls and keep direct, explicit imports.

### Runtime effects

Library code must not print or terminate the process. Public operations expose typed results or explicit errors according to their domain contract; async effects reject.
Keep Result only for documented validation reports or explicit capture/fallback boundaries.
Executable tools translate failures into output and exit status. Handle promise rejection deliberately;
do not discard it or convert a failed effect into success. Document callback ordering guarantees.

Own resources, release them predictably and respect the [runtime ownership](../architecture.md).
Diagnostics need stable technical codes and safe context, excluding credentials, user data,
environment dumps and raw backend messages.

Use ESM and `node:` built-ins in Node tooling, resolve I/O against an explicit base, stream large
payloads where appropriate, and prefer subprocess argument arrays over shell interpolation.
Temporary cleanup stays within verified owned paths. Platform APIs belong only at their designated
boundaries.

## Exceptions and tooling

Suppressions must name one rule, explain the reason nearby and remain narrowly scoped; stale
suppressions and broad ignore patterns fail review. Configuration exceptions need an adjacent reason.
A tool limitation is not proof of correctness. Type-aware TypeScript rules apply to all production
modules; scripts and external fixtures receive the applicable plain-JavaScript/standalone rules.

The SonarJS alias exception preserves meaningful named primitive aliases. Other existing exceptions
are described in the configuration and must not be broadened casually. Review automated fixes:
a type-to-interface rewrite can change assignability and needs the package compatibility check.
