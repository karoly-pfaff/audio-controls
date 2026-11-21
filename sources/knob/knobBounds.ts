import type { KnobProps } from './knobProps.ts';

export interface KnobBounds {
  readonly min: number;
  readonly max: number;
  readonly step: number;
}

export function knobBounds(props: KnobProps): KnobBounds {
  return { min: props.min ?? -1, max: props.max ?? 1, step: props.step ?? 0.01 };
}
