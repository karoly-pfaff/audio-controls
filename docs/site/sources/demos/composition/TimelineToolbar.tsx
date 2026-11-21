import type { ReactElement } from 'react';
import { TimelineZoom, formatTimelineTime } from '@karoly-pfaff/audio-controls-react/timeline';
import type { TimelineView } from '@karoly-pfaff/audio-controls-react/timeline';
import { DEMO_DURATION } from '../../fixtures/demoAudio.ts';

export function TimelineToolbar(props: {
  readonly view: TimelineView;
  readonly position: number;
  readonly seek: (seconds: number) => void;
}): ReactElement {
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <span className="track-title">Synthetic session / 01</span>
        <output>{formatTimelineTime(props.position, true)} / 02:00</output>
      </div>
      <TimelineZoom zoom={props.view.zoom} changeZoom={props.view.changeZoom} />
      <label>
        Source-time scrubber
        <input
          type="range"
          min={0}
          max={DEMO_DURATION}
          step={0.1}
          value={props.position}
          onChange={(event) => {
            props.seek(Number(event.target.value));
          }}
        />
      </label>
    </div>
  );
}
