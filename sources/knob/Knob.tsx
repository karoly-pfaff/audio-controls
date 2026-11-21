import type { ReactElement } from 'react';
import type { KnobProps } from './knobProps.ts';
import { formatControlValue } from '../value-formatting/formatControlValue.ts';
import { knobGeometry } from './knobGeometry.ts';
import { KnobFace } from './KnobFace.tsx';
import { useKnobInteraction } from './useKnobInteraction.ts';
import { knobBounds } from './knobBounds.ts';

export function Knob(props: KnobProps): ReactElement {
  const valueText = formatControlValue(props.value, props.unit ?? 'L/R');
  const bounds = knobBounds(props);
  const geometry = knobGeometry(props.value, bounds.min, bounds.max);
  const handlers = useKnobInteraction(props);
  return (
    <div className={`acr-knob-group knob-group ${props.className ?? ''}`}>
      <svg
        width={32}
        height={32}
        viewBox="0 0 32 32"
        className="knob"
        role="slider"
        tabIndex={props.disabled ? -1 : 0}
        aria-disabled={props.disabled}
        aria-label={props.accessibleLabel ?? `${props.label} (${valueText})`}
        aria-valuenow={props.value}
        aria-valuemin={bounds.min}
        aria-valuemax={bounds.max}
        aria-valuetext={valueText}
        {...handlers}
      >
        <KnobFace geometry={geometry} value={props.value} text={valueText} />
      </svg>
    </div>
  );
}
