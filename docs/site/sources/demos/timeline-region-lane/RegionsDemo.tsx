import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineRegionLane } from '@karoly-pfaff/audio-controls/timeline';
import { DEMO_REGIONS } from '../../fixtures/demoAudio.ts';

export function RegionsDemo(): ReactElement {
  const [seconds, setSeconds] = useState(0);
  return (
    <div className="demo-stack">
      <TimelineRegionLane
        regions={DEMO_REGIONS}
        durationSeconds={120}
        onSeek={setSeconds}
        label="Demo song sections"
      />
      <output>Region start: {seconds}s · use Tab and Enter to select a section</output>
    </div>
  );
}
