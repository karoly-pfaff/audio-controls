import { useState } from 'react';
import type { ReactElement } from 'react';
import {
  TimelineViewport,
  TimelineRuler,
  TimelineZoom,
} from '@karoly-pfaff/audio-controls-react/timeline';

export function ViewportDemo(): ReactElement {
  const [position, setPosition] = useState(30);
  return (
    <div className="demo-stack">
      <label>
        Zoom anchor: {position}s
        <input
          aria-label="Viewport anchor"
          type="range"
          min={0}
          max={120}
          value={position}
          onChange={(event) => {
            setPosition(Number(event.target.value));
          }}
        />
      </label>
      <TimelineViewport
        durationSeconds={120}
        positionSeconds={position}
        toolbar={(view) => <TimelineZoom zoom={view.zoom} changeZoom={view.changeZoom} />}
      >
        {(view) => (
          <>
            <TimelineRuler duration={120} zoom={view.zoom} />
            <div className="viewport-guide">Scroll this source-time surface · {view.zoom}×</div>
          </>
        )}
      </TimelineViewport>
    </div>
  );
}
