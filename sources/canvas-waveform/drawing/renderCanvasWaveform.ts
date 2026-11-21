import type { WaveformPeaks } from '../../waveform-model/waveformPeaks.ts';
import { drawVerticalLine } from './drawVerticalLine.ts';

export interface WaveformPaint {
  readonly peaks: WaveformPeaks | null;
  readonly width: number;
  readonly height: number;
  readonly color: string;
  readonly tickDurationSeconds?: number | undefined;
}

export function renderCanvasWaveform(options: WaveformPaint): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = options.width;
  canvas.height = options.height;
  const context = canvas.getContext('2d');
  if (context) paintWaveform(context, options);
  return canvas;
}

function paintWaveform(context: CanvasRenderingContext2D, options: WaveformPaint): void {
  if (!options.peaks) {
    paintEmptyWaveform(context, options);
    return;
  }
  const envelope = waveformEnvelope(options.peaks, options.height);
  fillEnvelope(context, envelope.top, { ...options, upward: true });
  fillEnvelope(context, envelope.bottom, { ...options, upward: false });
  strokeEnvelope(context, { ...envelope, ...options });
  paintTicks(context, options);
}

function waveformEnvelope(
  peaks: WaveformPeaks,
  height: number,
): { readonly top: readonly number[]; readonly bottom: readonly number[] } {
  const amplitude = height / 2;
  return {
    top: peaks.minimum.map((sample) => (1 + sample) * amplitude),
    bottom: peaks.maximum.map((sample) => (1 + sample) * amplitude),
  };
}

function paintEmptyWaveform(context: CanvasRenderingContext2D, options: WaveformPaint): void {
  Object.assign(context, { strokeStyle: options.color + '28' });
  context.setLineDash([3, 8]);
  context.beginPath();
  context.moveTo(0, options.height / 2);
  context.lineTo(options.width, options.height / 2);
  context.stroke();
}

function fillEnvelope(
  context: CanvasRenderingContext2D,
  points: readonly number[],
  options: WaveformPaint & { readonly upward: boolean },
): void {
  const center = options.height / 2;
  const gradient = context.createLinearGradient(0, center, 0, options.upward ? 0 : options.height);
  gradient.addColorStop(0, options.color + '00');
  gradient.addColorStop(1, options.color + '3A');
  Object.assign(context, { fillStyle: gradient });
  traceEnvelope(context, points, options);
  context.fill();
}

function traceEnvelope(
  context: CanvasRenderingContext2D,
  points: readonly number[],
  options: WaveformPaint,
): void {
  context.beginPath();
  context.moveTo(0, options.height / 2);
  points.forEach((vertical, index) => {
    context.lineTo((index * options.width) / points.length, vertical);
  });
  context.lineTo(options.width, options.height / 2);
  context.closePath();
}

function strokeEnvelope(
  context: CanvasRenderingContext2D,
  options: WaveformPaint & { readonly top: readonly number[]; readonly bottom: readonly number[] },
): void {
  Object.assign(context, {
    strokeStyle: options.color + 'A8',
    lineWidth: 1.5,
    shadowColor: options.color,
    shadowBlur: 6,
  });
  context.beginPath();
  options.top.forEach((point, index) => {
    const horizontal = (index * options.width) / options.top.length;
    if (index === 0) context.moveTo(horizontal, point);
    else {
      context.lineTo(horizontal, point);
      context.lineTo(horizontal, options.bottom[index] ?? options.height / 2);
    }
  });
  context.stroke();
}

function paintTicks(context: CanvasRenderingContext2D, options: WaveformPaint): void {
  const duration = options.tickDurationSeconds ?? 0;
  if (duration <= 30) return;
  context.save();
  Object.assign(context, { shadowColor: 'transparent', strokeStyle: 'rgba(255, 255, 255, 0.14)' });
  for (let time = 30; time < duration; time += 30) {
    drawVerticalLine(context, {
      horizontal: Math.floor((time / duration) * options.width),
      height: options.height,
    });
  }
  context.restore();
}
