# Documentation site and GitHub Pages

The documentation lives under docs/. Development and release guides live in
docs/development and docs/release; the web application lives in docs/site.

Run npm run docs:build with the Node/npm versions configured in CI. It emits the Pages-ready static
site directly into docs/site/build/: index.html and .nojekyll. Open the HTML locally or upload
that directory using the Pages workflow. All React, styles and scripts remain embedded, so the
same output works offline and at the project URL without base-path rewriting or a CDN.

## Ownership

- docs/site/content owns the authored HTML chapters and shell, grouped by topic.
- docs/site/sources/demos owns the live control examples and the complete timeline composition.
- docs/site/sources/fixtures owns explicitly synthetic peaks, regions and meter levels.
- docs/site/sources/navigation owns search, active sections, code copying and shell controls.
- docs/site/sources/styles owns documentation layout and isolated preview presentation.
- scripts/documentation owns bundling, TypeScript API introspection and rendering metadata.
- docs/development and docs/release own contributor, architecture and publication instructions.

The build emits the library first, typechecks docs/site/tsconfig.json, bundles the built public
package entries and generates API tables. Snippets come from the actual typed demo modules.
The owned generated site directory is validated and cleaned before writing output; authored
chapters and sources are never output targets. Generated content stays outside Git and the npm
package's build/ runtime directory.

## Pages pipeline

Library quality runs candidate/consumer checks, the strict serial quality/coverage gate and the
documentation build. For a main-branch push or manual run on main, it uploads docs/site/build
using upload-pages-artifact. Only a successful verify job can start the deployment job, which
uses deploy-pages with the github-pages environment and scoped Pages/OIDC permissions.
Pull requests build downloadable HTML previews without a Pages upload or deployment.

Expected project URL after the first deployment:
https://karoly-pfaff.github.io/audio-controls/

The existing CI owns this pipeline, so a second workflow does not repeat the same quality gate.
Main runs serialize rather than cancel an in-progress deployment. Package publishing stays in
its own manual workflow and only keeps the HTML as a release-candidate artifact.

Enable GitHub Actions as the Pages publishing source. See
[Pages setup](../release/github-pages.md). The site build is also usable locally.

## Verification and themes

Strict typed lint, component/effect boundaries, Knip and jscpd all include docs/site/sources.
Its strict tsconfig typechecks the demos; library production coverage remains unchanged.
Use short serial browser checks for project-subpath loading, anchors, search, theme switching,
keyboard interaction and narrow screens. Store screenshots under ignored output/playwright/.

The header themes the shell and ordinary previews. Scoped light/dark comparison cards remain
independent and demonstrate typed token overrides plus a concrete Canvas color prop. The
documentation uses shipped package theme rules, not a duplicate private control palette.
