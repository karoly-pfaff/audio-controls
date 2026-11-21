import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineRuler } from '@karoly-pfaff/audio-controls-react/timeline';

export function RulerDemo(): ReactElement {
  const [duration, setDuration] = useState(120);
  return (
    <div className="demo-stack">
      <label>
        Source duration
        <select
          value={duration}
          onChange={(event) => {
            setDuration(Number(event.target.value));
          }}
        >
          <option value={120}>2 minutes</option>
          <option value={30}>30 seconds</option>
          <option value={0.5}>0.5 seconds</option>
        </select>
      </label>
      <TimelineRuler duration={duration} zoom={1} />
    </div>
  );
}
