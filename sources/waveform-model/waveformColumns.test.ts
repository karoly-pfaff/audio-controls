import { expect, it } from 'vitest';
import { waveformColumns } from './waveformColumns.ts';

it('retains transients and the final tail when reducing the waveform', () => {
  expect(
    waveformColumns(
      {
        samplesPerPeak: 1024,
        minimum: [-0.1, -1, 0, -0.8, -0.4],
        maximum: [0.1, 0.3, 1, 0.8, 0.9],
      },
      2,
    ),
  ).toEqual([
    { minimum: -1, maximum: 0.3 },
    { minimum: -0.8, maximum: 1 },
  ]);
});

it('rejects invalid resolutions and accepts empty input without invented samples', () => {
  const peaks = { samplesPerPeak: 1024, minimum: [], maximum: [] } as const;
  expect(waveformColumns({ ...peaks, minimum: [], maximum: [] })).toEqual([]);
  expect(() => waveformColumns({ ...peaks, minimum: [], maximum: [] }, 0)).toThrow('resolution');
});
