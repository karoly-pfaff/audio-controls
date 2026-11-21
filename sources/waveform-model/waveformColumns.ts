import type { WaveformPeaks } from './waveformPeaks.ts';

interface WaveformColumn {
  readonly minimum: number;
  readonly maximum: number;
}

/** Aggregate extrema, never subsample: short transients remain visible on long tracks. */
export function waveformColumns(peaks: WaveformPeaks, columns = 512): readonly WaveformColumn[] {
  if (!Number.isInteger(columns) || columns < 1 || columns > 2048)
    throw new Error('Invalid waveform resolution.');
  const count = Math.min(peaks.maximum.length, columns);
  return Array.from({ length: count }, (_, index) => aggregateWaveformColumn(peaks, index, count));
}

function aggregateWaveformColumn(
  peaks: WaveformPeaks,
  index: number,
  count: number,
): WaveformColumn {
  const start = Math.floor((index * peaks.maximum.length) / count);
  const end = Math.floor(((index + 1) * peaks.maximum.length) / count);
  return {
    minimum: Math.min(...peaks.minimum.slice(start, end)),
    maximum: Math.max(...peaks.maximum.slice(start, end)),
  };
}
