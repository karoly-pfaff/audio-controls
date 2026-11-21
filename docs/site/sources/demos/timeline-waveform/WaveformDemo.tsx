import { useState } from 'react';
import type { ReactElement } from 'react';
import { TimelineWaveform } from '@karoly-pfaff/audio-controls-react/timeline';
import { DEMO_PEAKS } from '../../fixtures/demoAudio.ts';

export function WaveformDemo(): ReactElement {
  const [seconds, setSeconds] = useState(42);
  return (
    <div className="demo-stack">
      <TimelineWaveform
        peaks={DEMO_PEAKS}
        durationSeconds={120}
        onSeek={setSeconds}
        viewport={{ width: 720, contentWidth: 720, scrollLeft: 0 }}
        label="SVG demo waveform"
      />
      <label>
        Keyboard source-time scrubber: {seconds.toFixed(1)}s
        <input
          type="range"
          min={0}
          max={120}
          step={0.1}
          value={seconds}
          onChange={(event) => {
            setSeconds(Number(event.target.value));
          }}
        />
      </label>
    </div>
  );
}
