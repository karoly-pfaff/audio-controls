import { expect, it } from 'vitest';
import { waveformPeaksFromChannels } from './waveformPeaksFromChannels.ts';

it('keeps right-only, anti-phase and final-channel transients visible without mixing cancellation', () => {
  const channels = [new Float32Array([0, 0.8, 0]), new Float32Array([0, -0.8, 1])];
  const peaks = waveformPeaksFromChannels(channels, { columns: 3, aggregation: 'all-channels' });
  expect(peaks.maximum).toEqual([0, expect.closeTo(0.8), 1]);
  expect(peaks.minimum).toEqual([0, expect.closeTo(-0.8), 0]);
  expect(channels[1]).toEqual(new Float32Array([0, -0.8, 1]));
});

it('preserves the Layer Lab first-channel ceil-stride display policy explicitly', () => {
  const channels = [new Float32Array([0, 0.5, -0.5, 0, 0.9]), new Float32Array([1, 1, 1, 1, 1])];
  expect(waveformPeaksFromChannels(channels, { columns: 3, aggregation: 'first-channel' })).toEqual(
    {
      minimum: [0, -0.5, 0],
      maximum: [0.5, 0, expect.closeTo(0.9)],
    },
  );
});

it('bounds resolution and supports empty display input', () => {
  expect(() => waveformPeaksFromChannels([], { columns: 0, aggregation: 'all-channels' })).toThrow(
    RangeError,
  );
  expect(() =>
    waveformPeaksFromChannels([], { columns: 4097, aggregation: 'all-channels' }),
  ).toThrow(RangeError);
  expect(waveformPeaksFromChannels([], { columns: 2, aggregation: 'all-channels' })).toEqual({
    minimum: [0, 0],
    maximum: [0, 0],
  });
});
