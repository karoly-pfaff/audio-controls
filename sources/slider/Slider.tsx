import { useId } from 'react';
import type { ReactElement } from 'react';
import type { SliderProps } from './sliderProps.ts';
import { formatControlValue } from '../value-formatting/formatControlValue.ts';
import { sliderRange } from './sliderRange.ts';

export function Slider(props: SliderProps): ReactElement {
  const inputId = useId();
  const valueText = formatControlValue(props.value, props.unit ?? '');
  return (
    <div className={`acr-slider-group slider-group ${props.className ?? ''}`}>
      <label className="slider-label" htmlFor={inputId}>
        {props.showLabel !== false && <span className="slider-label-text">{props.label}</span>}
        <span className="slider-value">{valueText}</span>
      </label>
      <input
        type="range"
        id={inputId}
        className="slider"
        {...sliderRange(props)}
        value={props.value}
        disabled={props.disabled}
        aria-label={
          props.accessibleLabel ?? (props.label ? `${props.label} (${valueText})` : valueText)
        }
        aria-valuetext={valueText}
        onChange={(event) => {
          props.onChange(Number.parseFloat(event.target.value));
        }}
      />
    </div>
  );
}
