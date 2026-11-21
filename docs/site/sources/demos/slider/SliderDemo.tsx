import { useState } from 'react';
import type { ReactElement } from 'react';
import { Slider } from '@karoly-pfaff/audio-controls';

export function SliderDemo(): ReactElement {
  const [gain, setGain] = useState(0.75);
  return (
    <div className="demo-stack">
      <Slider label="Output gain" value={gain} onChange={setGain} unit="dB" />
      <Slider label="Mix" value={gain} onChange={setGain} />
      <Slider label="Unavailable channel" value={0.4} onChange={setGain} disabled />
      <output>Controlled linear value: {gain.toFixed(2)}</output>
    </div>
  );
}
