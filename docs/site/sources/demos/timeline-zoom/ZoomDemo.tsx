import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineZoom } from '@karoly-pfaff/audio-controls/timeline';

export function ZoomDemo(): ReactElement {
  const [zoom, setZoom] = useState(1);
  return (
    <div className="demo-stack">
      <TimelineZoom zoom={zoom} changeZoom={setZoom} />
      <output>Zoom: {zoom}× · fit resets to 1× · maximum 32×</output>
    </div>
  );
}
