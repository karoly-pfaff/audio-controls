import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineRuler, TimelinePlayhead } from '@karoly-pfaff/audio-controls/timeline';

export function PlayheadDemo(): ReactElement {
  const [position, setPosition] = useState(42);
  return (
    <div className="demo-stack">
      <div className="playhead-stage">
        <TimelineRuler duration={120} zoom={1} />
        <div className="viewport-guide">Controlled source position</div>
        <TimelinePlayhead positionSeconds={position} durationSeconds={120} />
      </div>
      <label>
        Source position: {position}s
        <input
          type="range"
          min={0}
          max={120}
          value={position}
          onChange={(event) => {
            setPosition(Number(event.target.value));
          }}
        />
      </label>
    </div>
  );
}
