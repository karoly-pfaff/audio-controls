import { useState } from 'react';
import type { ReactElement } from 'react';
import { CanvasWaveform, waveformPeaksFromChannels } from '@karoly-pfaff/audio-controls';

export function PeaksDemo(): ReactElement {
  const [allChannels, setAllChannels] = useState(true);
  const right = Float32Array.from({ length: 256 }, (_, index) => Math.sin(index * 0.6) * 0.75);
  const peaks = waveformPeaksFromChannels([new Float32Array(256), right], {
    columns: 128,
    aggregation: allChannels ? 'all-channels' : 'first-channel',
  });
  return (
    <div className="demo-stack">
      <label>
        <input
          type="checkbox"
          checked={allChannels}
          onChange={(event) => {
            setAllChannels(event.target.checked);
          }}
        />{' '}
        Aggregate all channels
      </label>
      <CanvasWaveform peaks={peaks} width={720} height={48} interactive={false} />
      <small>Left channel is silent. Right channel contains a synthetic sine wave.</small>
    </div>
  );
}
