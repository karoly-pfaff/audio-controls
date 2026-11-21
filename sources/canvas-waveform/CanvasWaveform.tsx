import type { ReactElement } from 'react';
import type { CanvasWaveformProps } from './canvasWaveformProps.ts';
import { useCanvasWaveform } from './useCanvasWaveform.ts';
import { useWaveformSeeking } from './useWaveformSeeking.ts';
import { canvasAccessibility } from './canvasAccessibility.ts';
import { canvasPaintOptions } from './canvasPaintOptions.ts';

export function CanvasWaveform(props: CanvasWaveformProps): ReactElement {
  const canvas = useCanvasWaveform(props);
  const seeking = useWaveformSeeking(props);
  const { interactive, attributes } = canvasAccessibility(props);
  const paint = canvasPaintOptions(props);
  return (
    <canvas
      ref={canvas}
      width={paint.width}
      height={paint.height}
      className={`acr-waveform waveform-canvas${interactive ? ' waveform-canvas--seekable' : ''}`}
      style={{
        width: '100%',
        height: paint.height,
        touchAction: interactive ? 'none' : undefined,
      }}
      {...attributes}
      {...seeking}
      {...props.handlers}
    />
  );
}
