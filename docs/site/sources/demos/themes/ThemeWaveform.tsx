import { useState } from 'react';
import type { ReactElement } from 'react';
import { CanvasWaveform } from '@karoly-pfaff/audio-controls-react';
import { DEMO_PEAKS } from '../../fixtures/demoAudio.ts';

export function ThemeWaveform(props: { readonly color: string }): ReactElement {
  const [position, setPosition] = useState(0.35);
  return (
    <CanvasWaveform
      peaks={DEMO_PEAKS}
      width={720}
      height={48}
      color={props.color}
      playhead={position}
      onSeek={setPosition}
      accessibleLabel="Theme canvas seek"
    />
  );
}
