import type { CanvasWaveformProps } from '../canvasWaveformProps.ts';
import { canvasPaintOptions } from '../canvasPaintOptions.ts';
import { renderCanvasWaveform } from './renderCanvasWaveform.ts';
import type { WaveformPaint } from './renderCanvasWaveform.ts';
import { drawVerticalLine } from './drawVerticalLine.ts';

type WaveformPainter = (canvas: HTMLCanvasElement, props: CanvasWaveformProps) => void;

export function createWaveformPainter(): WaveformPainter {
  let cached: {
    readonly key: string;
    readonly peaks: CanvasWaveformProps['peaks'];
    readonly image: HTMLCanvasElement;
  } | null = null;
  const backgroundFor = (options: WaveformPaint): HTMLCanvasElement => {
    const key = [
      options.width,
      options.height,
      options.color,
      options.tickDurationSeconds ?? 0,
    ].join(':');
    if (cached?.key !== key || cached.peaks !== options.peaks)
      cached = { key, peaks: options.peaks, image: renderCanvasWaveform(options) };
    return cached.image;
  };
  return (canvas, props) => {
    const context = canvas.getContext('2d');
    if (!context) return;
    const options = canvasPaintOptions(props);
    context.clearRect(0, 0, options.width, options.height);
    context.drawImage(backgroundFor(options), 0, 0);
    drawPlayhead(context, { ...options, ratio: props.playhead });
  };
}

function drawPlayhead(
  context: CanvasRenderingContext2D,
  options: WaveformPaint & { readonly ratio: number | undefined },
): void {
  if (!options.peaks || options.ratio === undefined || options.ratio < 0 || options.ratio > 1)
    return;
  context.save();
  Object.assign(context, {
    strokeStyle: 'rgba(255, 255, 255, 0.80)',
    lineWidth: 1,
    shadowColor: 'rgba(255, 255, 255, 0.45)',
    shadowBlur: 4,
  });
  drawVerticalLine(context, {
    horizontal: Math.floor(options.ratio * options.width),
    height: options.height,
  });
  context.restore();
}
