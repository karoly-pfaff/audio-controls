import type { ReactElement } from 'react';
import {
  TimelineRuler,
  TimelineWaveform,
  TimelineRegionLane,
  TimelinePlayhead,
} from '@karoly-pfaff/audio-controls/timeline';
import type { TimelineView } from '@karoly-pfaff/audio-controls/timeline';
import { DEMO_DURATION, DEMO_PEAKS, DEMO_REGIONS } from '../../fixtures/demoAudio.ts';

export function TimelineLanes(props: {
  readonly view: TimelineView;
  readonly position: number;
  readonly seek: (seconds: number) => void;
}): ReactElement {
  return (
    <>
      <TimelineRuler duration={DEMO_DURATION} zoom={props.view.zoom} />
      <TimelineWaveform
        peaks={DEMO_PEAKS}
        viewport={props.view.viewport}
        durationSeconds={DEMO_DURATION}
        onSeek={props.seek}
        label="Composed source waveform"
      />
      <TimelineRegionLane
        regions={DEMO_REGIONS}
        durationSeconds={DEMO_DURATION}
        onSeek={props.seek}
      />
      <TimelinePlayhead positionSeconds={props.position} durationSeconds={DEMO_DURATION} />
    </>
  );
}
