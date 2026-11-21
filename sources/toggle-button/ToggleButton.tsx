import type { ReactElement } from 'react';
import type { ToggleButtonProps } from './toggleButtonProps.ts';

export function ToggleButton(props: ToggleButtonProps): ReactElement {
  const stateClass = props.active ? ' toggle-btn--active' : '';
  return (
    <button
      className={`acr-toggle toggle-btn toggle-btn--${props.variant ?? 'default'}${stateClass}`}
      onClick={props.onClick}
      disabled={props.disabled}
      type="button"
      aria-pressed={props.active}
      aria-label={props.ariaLabel}
      title={props.title}
    >
      {props.label}
    </button>
  );
}
