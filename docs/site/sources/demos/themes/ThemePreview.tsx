import { useState } from 'react';
import type { ReactElement } from 'react';
import { Slider, Knob, ToggleButton } from '@karoly-pfaff/audio-controls';
import { TimelineRuler, TimelineWaveform } from '@karoly-pfaff/audio-controls/timeline';
import { DEMO_PEAKS } from '../../fixtures/demoAudio.ts';
import { ThemeWaveform } from './ThemeWaveform.tsx';

export function ThemePreview(props: { readonly color: string }): ReactElement {
  const [gain, setGain] = useState(0.75);
  const [pan, setPan] = useState(0);
  const [loop, setLoop] = useState(true);
  return (
    <div className="demo-stack">
      <Slider label="Theme gain" value={gain} onChange={setGain} unit="dB" />
      <div className="demo-row">
        <Knob label="Theme pan" value={pan} onChange={setPan} />
        <ToggleButton
          label="Loop"
          variant="loop"
          active={loop}
          onClick={() => {
            setLoop(!loop);
          }}
        />
      </div>
      <ThemeWaveform color={props.color} />
      <div>
        <TimelineRuler duration={120} zoom={1} />
        <TimelineWaveform
          peaks={DEMO_PEAKS}
          durationSeconds={120}
          viewport={{ width: 400, contentWidth: 400, scrollLeft: 0 }}
          label="Theme SVG waveform"
        />
      </div>
    </div>
  );
}
