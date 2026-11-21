import type { ReactElement } from 'react';
import { transportButtons } from './transportButtons.ts';
import { TransportButton } from '../transport-button/TransportButton.tsx';

export interface TransportControlsProps {
  readonly playing: boolean;
  readonly disabled: boolean;
  readonly playable: boolean;
  readonly play: () => void;
  readonly pause: () => void;
  readonly stop: () => void;
  readonly seekToStart: () => void;
  readonly jumpBack: () => void;
  readonly jumpForward: () => void;
}

export function TransportControls(props: TransportControlsProps): ReactElement {
  return (
    <div className="acr-transport transport-controls">
      <div className="transport-buttons">
        {transportButtons(props).map((button) => (
          <TransportButton key={button.icon} {...button} />
        ))}
      </div>
    </div>
  );
}
