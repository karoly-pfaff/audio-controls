import type { WaveformPeaks } from './waveformPeaks.ts';

export function waveformPeaksFromChannels(
  channels: readonly Float32Array[],
  options: { readonly columns: number; readonly aggregation: 'first-channel' | 'all-channels' },
): WaveformPeaks {
  validateWaveformResolution(options.columns);
  const selected = options.aggregation === 'first-channel' ? channels.slice(0, 1) : channels;
  const length = selected[0]?.length ?? 0;
  const columns = Array.from({ length: options.columns }, (_, index) =>
    channelColumn(selected, {
      index,
      count: options.columns,
      length,
      legacy: options.aggregation === 'first-channel',
    }),
  );
  return {
    minimum: columns.map((column) => column.minimum),
    maximum: columns.map((column) => column.maximum),
  };
}

function validateWaveformResolution(columns: number): void {
  if (!Number.isInteger(columns) || columns < 1 || columns > 4096)
    throw new RangeError('Invalid waveform resolution.');
}

interface ColumnWindow {
  readonly index: number;
  readonly count: number;
  readonly length: number;
  readonly legacy: boolean;
}

function channelRange(options: ColumnWindow): readonly [number, number] {
  const stride = Math.ceil(options.length / options.count);
  const start = options.legacy
    ? options.index * stride
    : Math.min(options.length - 1, Math.floor((options.index * options.length) / options.count));
  const end = options.legacy
    ? start + stride
    : Math.min(
        options.length,
        Math.max(start + 1, Math.ceil(((options.index + 1) * options.length) / options.count)),
      );
  return [start, end];
}

function channelColumn(
  channels: readonly Float32Array[],
  options: ColumnWindow,
): { readonly minimum: number; readonly maximum: number } {
  const [start, end] = channelRange(options);
  const range = { minimum: 0, maximum: 0 };
  for (const channel of channels) {
    for (let index = Math.max(0, start); index < end; index++) {
      const sample = channel[index] ?? 0;
      range.minimum = Math.min(range.minimum, sample);
      range.maximum = Math.max(range.maximum, sample);
    }
  }
  return range;
}
