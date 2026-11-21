import type { CanvasHTMLAttributes } from 'react';
import type { WaveformPeaks } from '../waveform-model/waveformPeaks.ts';

export type WaveformHandlers = Pick<
  CanvasHTMLAttributes<HTMLCanvasElement>,
  | 'onKeyDown'
  | 'onPointerDown'
  | 'onPointerMove'
  | 'onPointerUp'
  | 'onPointerCancel'
  | 'onPointerLeave'
  | 'onDoubleClick'
>;

export interface CanvasWaveformProps {
  readonly peaks: WaveformPeaks | null;
  readonly width?: number | undefined;
  readonly height?: number | undefined;
  readonly color?: string | undefined;
  readonly playhead?: number | undefined;
  readonly tickDurationSeconds?: number | undefined;
  readonly onSeek?: ((ratio: number) => void) | undefined;
  readonly accessibleLabel?: string | undefined;
  readonly interactive?: boolean | undefined;
  readonly handlers?: WaveformHandlers | undefined;
}
