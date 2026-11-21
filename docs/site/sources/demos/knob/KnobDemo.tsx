import { useState } from 'react';
import type { ReactElement } from 'react';
import { Knob, Slider } from '@karoly-pfaff/audio-controls-react';

export function KnobDemo(): ReactElement {
  const [pan, setPan] = useState(0);
  return (
    <div className="demo-stack">
      <div className="demo-row">
        <Knob label="Pan" value={pan} onChange={setPan} />
        <span>Pan · drag vertically or use arrow keys</span>
      </div>
      <Slider label="Pan position" value={pan} min={-1} max={1} unit="L/R" onChange={setPan} />
      <output>Pan: {pan.toFixed(2)} · double-click the knob to reset</output>
    </div>
  );
}
