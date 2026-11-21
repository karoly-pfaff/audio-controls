import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineViewport } from '@karoly-pfaff/audio-controls-react/timeline';
import { TimelineLanes } from './TimelineLanes.tsx';
import { TimelineToolbar } from './TimelineToolbar.tsx';
import { DEMO_DURATION } from '../../fixtures/demoAudio.ts';

export function TimelineDemo(): ReactElement {
  const [position, setPosition] = useState(42);
  return (
    <div className="demo-stack">
      <TimelineViewport
        durationSeconds={DEMO_DURATION}
        positionSeconds={position}
        label="Composed timeline"
        toolbar={(view) => <TimelineToolbar view={view} position={position} seek={setPosition} />}
      >
        {(view) => <TimelineLanes view={view} position={position} seek={setPosition} />}
      </TimelineViewport>
      <small>
        Synthetic waveform · 2-minute source · click regions or waveform, then zoom and scroll.
      </small>
    </div>
  );
}
