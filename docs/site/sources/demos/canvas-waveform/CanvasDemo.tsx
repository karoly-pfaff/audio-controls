import { useState } from 'react';
import type { ReactElement } from 'react';
import { CanvasWaveform } from '@karoly-pfaff/audio-controls';
import { DEMO_PEAKS } from '../../fixtures/demoAudio.ts';

export function CanvasDemo(): ReactElement {
  const [ratio, setRatio] = useState(0.35);
  return (
    <div className="demo-stack">
      <CanvasWaveform
        peaks={DEMO_PEAKS}
        width={720}
        height={72}
        color="#a78bfa"
        tickDurationSeconds={120}
        playhead={ratio}
        onSeek={setRatio}
        accessibleLabel="Canvas demo seek"
      />
      <output>
        Position: {Math.round(ratio * 100)}% · source time: {(ratio * 120).toFixed(1)}s
      </output>
      <small>Click or focus the waveform and use arrows, Home or End.</small>
    </div>
  );
}
