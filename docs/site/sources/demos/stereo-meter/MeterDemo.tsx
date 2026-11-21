import { useCallback, useState } from 'react';
import type { ReactElement } from 'react';
import { StereoMeter } from '@karoly-pfaff/audio-controls-react';
import { readDemoLevels } from '../../fixtures/demoAudio.ts';

export function MeterDemo(): ReactElement {
  const [running, setRunning] = useState(false);
  const readLevels = useCallback(
    () => (running ? readDemoLevels() : { left: 0, right: 0 }),
    [running],
  );
  return (
    <div className="demo-row">
      <StereoMeter playing={running} readLevels={readLevels} />
      <button
        type="button"
        aria-pressed={running}
        onClick={() => {
          setRunning(!running);
        }}
      >
        {running ? 'Stop simulated levels' : 'Start simulated levels'}
      </button>
      <small>Synthetic normalized levels, without an audio context.</small>
    </div>
  );
}
