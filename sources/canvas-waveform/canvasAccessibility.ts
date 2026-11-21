import type { CanvasHTMLAttributes } from 'react';
import type { CanvasWaveformProps } from './canvasWaveformProps.ts';

type CanvasAccessibility = Pick<
  CanvasHTMLAttributes<HTMLCanvasElement>,
  | 'role'
  | 'tabIndex'
  | 'aria-label'
  | 'aria-valuenow'
  | 'aria-valuemin'
  | 'aria-valuemax'
  | 'aria-valuetext'
>;

export function canvasAccessibility(props: CanvasWaveformProps): {
  readonly interactive: boolean;
  readonly attributes: CanvasAccessibility;
} {
  const interactive = props.interactive ?? Boolean(props.peaks && props.onSeek);
  if (!interactive) return { interactive, attributes: {} };
  const percent = Math.round((props.playhead ?? 0) * 100);
  return {
    interactive,
    attributes: {
      role: 'slider',
      tabIndex: 0,
      'aria-label': props.accessibleLabel ?? 'Seek position',
      'aria-valuenow': percent,
      'aria-valuemin': 0,
      'aria-valuemax': 100,
      'aria-valuetext': String(percent) + '%',
    },
  };
}
