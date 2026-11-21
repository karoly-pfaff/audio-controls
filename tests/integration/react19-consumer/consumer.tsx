import { Slider, Knob, StereoMeter, CanvasWaveform } from '@karoly-pfaff/audio-controls-react';
import {
  TimelineViewport,
  TimelineWaveform,
  TimelineRuler,
  TimelinePlayhead,
} from '@karoly-pfaff/audio-controls-react/timeline';

export const controls = (
  <>
    <Slider label="Volume" value={0.5} onChange={() => undefined} />
    <Knob label="Pan" value={0} onChange={() => undefined} />
    <StereoMeter playing={false} readLevels={() => ({ left: 0, right: 0 })} />
    <CanvasWaveform peaks={{ minimum: [0], maximum: [0] }} />
  </>
);

// @ts-expect-error Published gain values must remain numeric, never an unchecked any.
<Slider label="Type probe" value="invalid" onChange={() => undefined} />;
// @ts-expect-error A measured viewport offset is a pixel count, not a string.
<TimelinePlayhead durationSeconds={60} positionSeconds="invalid" />;

export const timeline = (
  <TimelineViewport durationSeconds={60} positionSeconds={15}>
    {(view) => (
      <>
        <TimelineRuler duration={60} zoom={view.zoom} />
        <TimelineWaveform
          peaks={{ minimum: [-1], maximum: [1] }}
          viewport={view.viewport}
          durationSeconds={60}
        />
        <TimelinePlayhead durationSeconds={60} positionSeconds={15} />
      </>
    )}
  </TimelineViewport>
);
