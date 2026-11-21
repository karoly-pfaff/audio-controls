import { expect, it } from 'vitest';
import { waveformOutline } from './waveformOutline.ts';

it('fills aggregated extrema at their original source offsets without smoothing transients', () => {
  expect(
    waveformOutline({
      offset: 20,
      length: 4,
      total: 100,
      columns: [
        { minimum: -0.5, maximum: 1 },
        { minimum: -1, maximum: 0.5 },
      ],
    }),
  ).toBe('M20 0L22 0L22 25L24 25L24 100L22 100L22 75L20 75Z');
});

it('does not invent an amplitude for a silent single bin', () => {
  expect(
    waveformOutline({
      offset: 0,
      length: 1,
      total: 1,
      columns: [{ minimum: 0, maximum: 0 }],
    }),
  ).toBe('M0 50L1 50L1 50L0 50Z');
});

it('keeps unavailable samples empty rather than manufacturing a waveform', () => {
  expect(waveformOutline({ offset: 0, length: 0, total: 0, columns: [] })).toBe('');
});
