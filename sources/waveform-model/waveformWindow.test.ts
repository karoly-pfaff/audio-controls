import { expect, it } from 'vitest';
import { waveformWindow } from './waveformWindow.ts';

it('aggregates only the visible source window and keeps transients and global offsets', () => {
  const maximum = Array.from({ length: 100000 }, () => 0.1);
  maximum[50000] = 1;
  const peaks: Parameters<typeof waveformWindow>[0] = {
    samplesPerPeak: 1024,
    maximum,
    minimum: maximum.map((value) => -value),
  };
  const wave = waveformWindow(peaks, { width: 1440, contentWidth: 46080, scrollLeft: 22400 });
  expect(wave.offset).toBeGreaterThan(48000);
  expect(wave.offset).toBeLessThan(50000);
  expect(wave.columns).toHaveLength(512);
  expect(wave.columns.some((column) => column.maximum > 0.99)).toBe(true);
  expect(wave.total).toBe(100000);
});

it('retains an honest empty waveform instead of manufacturing samples', () => {
  const wave = waveformWindow(
    { samplesPerPeak: 1024, minimum: [], maximum: [] },
    { width: 0, scrollLeft: 0, contentWidth: 0 },
  );
  expect(wave.total).toBe(0);
  expect(wave.columns).toEqual([]);
});
