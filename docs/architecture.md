# Package architecture

Every public control owns a named directory directly under sources/: slider, knob, toggle-button,
transport-controls, transport-button, stereo-meter, canvas-waveform, timeline-viewport,
timeline-ruler, timeline-waveform, timeline-region-lane, timeline-playhead and timeline-zoom.
Its props, supporting components, hooks and colocated tests stay with that owner. There is no common
controls directory. The [layout review](development/repository-layout.md) records directory counts.

Cohesive value-formatting, keyboard-input, waveform-model and timeline/model modules share pure
behavior through direct imports. sources/index.ts and sources/timeline/index.ts are the two public
API entries; internal forwarding barrels are unnecessary. Imports use source extensions rewritten
to JavaScript by TypeScript. Build cleans only its owned build/ output before emitting files, so
renamed source directories cannot leave stale published modules.

Every production UI module has one component or one effect definition. Data, drawing, pointer
interaction and effect synchronization have explicit owners. Hosts supply audio engines, prepared
peaks, state, persistence and browser capabilities. Importing the package creates no audio context,
worker, global event listener or outbound request. Timeline and seeking use controlled source time.

React 18 is the producer test runtime. React 19 compatibility is checked by the independently
installed tarball consumer in tests/integration/react19-consumer. Build and pack into artifacts/, install
that fixture's recorded dependencies, then run its check script. It resolves package declarations
and ESM, without producer source aliases. No DOM globals are required to import the package or
render its ruler and slider on the server.

The [quality gate](development/code-quality.md) requires strict lint, zero duplication, no dead code,
control ownership and 100% coverage in every executable production file. Host applications test
their own browser integration, audio lifecycle and rendering/export behavior.

The optional stylesheet includes explicitly scoped light/dark themes selected by data-acr-theme
on a container. Palette tokens inherit within a scope; nested containers reset the palette and
sizing defaults. Each control retains its owner. sources/themes owns only palette/presentation
CSS, not control components. The build copies that CSS dependency tree beside styles.css, keeping
relative imports resolvable in the package artifact. There are no runtime preference listeners.
Canvas raster colors remain an explicit color prop; the plot surface preserves overlay contrast.

The web documentation is owned by docs/site, within the single docs/ namespace. Sources and
chapters compile into its separate build/ site artifact. CI uploads that artifact and deploys it
to GitHub Pages after verification on main. Development/release Markdown remains under docs/;
tests/integration owns the independent packed-package consumer. The npm archive keeps only library
build output and public package/legal files, so site output cannot leak into the runtime package.
