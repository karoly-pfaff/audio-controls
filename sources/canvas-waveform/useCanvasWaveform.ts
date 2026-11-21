import { useEffect, useRef, useState } from 'react';
import type { RefObject } from 'react';
import type { CanvasWaveformProps } from './canvasWaveformProps.ts';
import { createWaveformPainter } from './drawing/createWaveformPainter.ts';

export function useCanvasWaveform(props: CanvasWaveformProps): RefObject<HTMLCanvasElement> {
  const canvas = useRef<HTMLCanvasElement>(null);
  const [paint] = useState(createWaveformPainter);
  const { peaks, width, height, color, tickDurationSeconds, playhead } = props;
  useEffect(() => {
    if (canvas.current)
      paint(canvas.current, { peaks, width, height, color, tickDurationSeconds, playhead });
  }, [paint, peaks, width, height, color, tickDurationSeconds, playhead]);
  return canvas;
}
