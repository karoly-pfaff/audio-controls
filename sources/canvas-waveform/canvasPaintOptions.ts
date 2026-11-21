import type { CanvasWaveformProps } from './canvasWaveformProps.ts';
import type { WaveformPaint } from './drawing/renderCanvasWaveform.ts';

export function canvasPaintOptions(props: CanvasWaveformProps): WaveformPaint {
  return {
    peaks: props.peaks,
    width: props.width ?? 800,
    height: props.height ?? 48,
    color: props.color ?? '#00e5ff',
    tickDurationSeconds: props.tickDurationSeconds,
  };
}
