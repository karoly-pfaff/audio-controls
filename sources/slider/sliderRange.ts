import type { SliderProps } from './sliderProps.ts';

export function sliderRange(props: SliderProps): {
  readonly min: number;
  readonly max: number;
  readonly step: number;
} {
  return { min: props.min ?? 0, max: props.max ?? 1, step: props.step ?? 0.01 };
}
