import type { ReactElement } from 'react';
import { TransportIcon } from './TransportIcon.tsx';
import type { TransportIconKind } from './TransportIcon.tsx';

export interface TransportButtonProps {
  readonly icon: TransportIconKind;
  readonly label: string;
  readonly title?: string | undefined;
  readonly disabled?: boolean | undefined;
  readonly active?: boolean | undefined;
  readonly onClick: () => void;
}

export function TransportButton(props: TransportButtonProps): ReactElement {
  const kind = props.icon === 'pause' ? 'play' : props.icon;
  const suffix = props.active ? ' transport-btn--active' : '';
  const jumpClass = ['restart', 'back', 'forward'].includes(props.icon)
    ? ' transport-btn--jump'
    : '';
  return (
    <button
      type="button"
      className={`acr-transport-button transport-btn transport-btn--${kind}${jumpClass}${suffix}`}
      aria-label={props.label}
      title={props.title}
      disabled={props.disabled}
      onClick={() => {
        props.onClick();
      }}
    >
      <TransportIcon kind={props.icon} />
    </button>
  );
}
