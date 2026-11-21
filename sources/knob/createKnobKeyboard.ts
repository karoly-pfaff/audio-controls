import type { KeyboardEventHandler } from 'react';
import type { KnobProps } from './knobProps.ts';
import type { KnobBounds } from './knobBounds.ts';
import { keyboardDirection } from '../keyboard-input/keyboardDirection.ts';

export function createKnobKeyboard(
  props: KnobProps,
  context: {
    readonly bounds: KnobBounds;
    readonly change: (value: number) => void;
  },
): KeyboardEventHandler<SVGSVGElement> {
  return (event) => {
    const value = keyboardKnobValue(event.key, props.value, context.bounds);
    if (value === null || props.disabled) return;
    event.preventDefault();
    context.change(Number(value.toFixed(10)));
  };
}

function keyboardKnobValue(key: string, value: number, bounds: KnobBounds): number | null {
  if (key === 'Home') return bounds.min;
  if (key === 'End') return bounds.max;
  const direction = keyboardDirection(key);
  return direction === null ? null : value + direction * bounds.step;
}
