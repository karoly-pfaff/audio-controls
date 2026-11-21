# Audio Controls

Controlled React audio controls and source-time timeline components.
The package supports React ^18.3.1 and ^19.0.0 through a peer dependency.
It contains no audio engine, analyzer, application store, service, persistence or runtime networking.

## Installation from GitHub Packages

For a published version, authenticate with GitHub Packages and install the exact scoped version:

```sh
npm login --scope=@karoly-pfaff --auth-type=legacy --registry=https://npm.pkg.github.com
npm config set @karoly-pfaff:registry=https://npm.pkg.github.com --location=project
npm install --save-exact @karoly-pfaff/audio-controls@0.1.0
```

GitHub requires authentication for public npm packages too. See the
[release and consumer guide](docs/release/github-packages.md) for workflow setup, access and
migration aliases. To build a local tarball, follow [local development](#local-development).

## Quick start

```tsx
import { useState } from 'react';
import type { ReactElement } from 'react';
import { Slider } from '@karoly-pfaff/audio-controls';
import '@karoly-pfaff/audio-controls/styles.css';

export function OutputGain(): ReactElement {
  const [gain, setGain] = useState(0.75);
  return (
    <div data-acr-theme="light">
      <Slider label="Output gain" value={gain} unit="dB" onChange={setGain} />
    </div>
  );
}
```

Update the supplied value in onChange; the controls keep application state in the host.
The example displays linear gain as dB. Connect the value to your audio engine in the host action.
Use a React bundler with ESM and CSS import support, including its TypeScript declarations for CSS.

## Public entries

| Entry                                     | Exports                                                                                                                                          |
| ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `@karoly-pfaff/audio-controls`            | Slider, Knob, ToggleButton, TransportControls, TransportButton, StereoMeter, CanvasWaveform, waveformPeaksFromChannels and their prop/data types |
| `@karoly-pfaff/audio-controls/timeline`   | TimelineViewport, TimelineRuler, TimelineWaveform, TimelineRegionLane, TimelinePlayhead, TimelineZoom and source-time geometry/peak helpers      |
| `@karoly-pfaff/audio-controls/styles.css` | Optional default styling, scoped to `acr-` classes                                                                                               |

All controls receive their values and actions from the host. Linear gain, pan in the range -1 to 1,
source seconds and waveform position ratios are distinct units. A dB display label formats linear
gain; it does not change the value passed to the host. `StereoMeter.readLevels` supplies normalized
display levels in the range 0 to 1, with attack/decay smoothing applied by the view.
The meter never creates an audio tap or context.

Host class hooks are available alongside namespaced classes for application themes.
The optional stylesheet is not imported automatically and contains no body styles or remote assets.
Applications can provide timeline class names and their own toolbar, scrubber and lane content. Accessible
keyboard seeking belongs to the host scrubber when the SVG timeline waveform is displayed as an
image. The canvas waveform provides its own keyboard seeking unless host selection handlers replace
it. No global keyboard listener is installed.

## Light and dark themes

Import `@karoly-pfaff/audio-controls/styles.css`, then wrap controls in a container with
`data-acr-theme="light"` or `data-acr-theme="dark"`. Theme groups can be nested independently.
Override `--acr-accent`, `--acr-on-accent`, `--acr-waveform`, `--acr-radius` and the other
semantic tokens on the same container to match your application. Palette rules have zero
specificity. The HTML documentation includes both palettes, live customization and the complete
token/default reference under “Light & dark themes”. CanvasWaveform uses a concrete six-digit
hex color prop; its plot surface is styled separately for raster overlay contrast.

## Timeline composition

`TimelineViewport` owns zoom anchoring, horizontal scroll and resize observation. It passes a
`TimelineView` to the `toolbar` and `children` render callbacks. Its `zoom`, `changeZoom` and
`viewport` fields keep all lanes on the same full-song axis. Compose the ruler, waveform, regions
and playhead with application-owned lanes inside that content surface.

`TimelineWaveform` consumes prepared minimum/maximum peaks and renders only the visible source
window with bounded aggregation. Seek callbacks receive complete source seconds, including when
the content is scrolled or zoomed. Peaks must have equal-length arrays of finite extrema on a
uniform time axis; validate persisted or external data at the host boundary. No browser audio
buffer, project score document or analysis package is required.

## Waveforms

`CanvasWaveform` also accepts prepared peaks and controlled playhead data. It caches the background
by peak identity, dimensions, color and tick configuration. Pointer/keyboard handlers may be
supplied by a host that owns range selection and annotations. Markers, selections and inspection
overlays remain controlled host data.

`waveformPeaksFromChannels` prepares display extrema from channel arrays. The explicit
`first-channel` mode uses ceil-stride display reduction; `all-channels` uses proportional
buckets, including right-only, anti-phase and final-sample events. This helper
is display reduction, not an audio-analysis or decoding API. Input arrays are not mutated.

## Local development

Use Node 24 and npm 11 with the committed lockfiles:

```sh
npm ci
npm run package:check
npm run check
npm run docs:build
npm run release:check
```

Run package:check before the full gate on a fresh checkout. It builds the archive and installs
the independent React 19 consumer required by typed lint. The serial gate includes strict typed
ESLint/SonarJS, structural/naming rules, jscpd, Knip, control layout, typecheck, tooling regressions
and coverage. Tests use one worker. Every executable production file must reach 100% statements,
branches, functions and lines; the threshold is per file, including unimported sources.

Each public control has its own named directory under sources/. Pure models are shared through
explicit imports. Read [AGENTS.md](AGENTS.md) and the [quality rules](docs/development/code-quality.md)
before changing code; [CLAUDE.md](CLAUDE.md) points to the same contract.

The versioned tarball in artifacts/ can be installed directly in a consumer application.
Use the documented package entries and update consumer lockfiles when replacing a local artifact.
Published versions are immutable; use an exact scoped version or the documented migration alias.

Authored code uses sources/ and generated output uses build/. Install the archive or scoped
package; public consumers require no producer-workspace source imports.

## Documentation and GitHub Pages

The Pages workflow publishes to https://karoly-pfaff.github.io/audio-controls/.
Web sources and chapters live in docs/site; contributor and release guides share the docs/ namespace.

Run `npm run docs:build`, then open
`docs/site/build/index.html` directly in a browser. The generated HTML embeds React,
the actual package controls, styles, sixteen live demos, copyable example sources and API tables
generated from the current TypeScript definitions. The same output is uploaded directly to
GitHub Pages after a successful main-branch CI run. It also works offline without a server or CDN.
See [documentation authoring](docs/development/html-documentation.md) for its structure and
[Pages setup](docs/release/github-pages.md) for deployment configuration.

The project is [MIT licensed](LICENSE). See the [changelog](CHANGELOG.md) for version contents.

## Support

Support this project through [GitHub Sponsors](https://github.com/sponsors/karoly-pfaff).
