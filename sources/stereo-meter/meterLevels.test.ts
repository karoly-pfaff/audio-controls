import { expect, it } from 'vitest';
import { smoothMeterLevel } from './meterLevels.ts';

it('uses fast attack, slower decay and bounded output for invalid meter samples', () => {
  expect(smoothMeterLevel(0, 1)).toBeCloseTo(0.7);
  expect(smoothMeterLevel(1, 0)).toBeCloseTo(0.88);
  expect(smoothMeterLevel(0.5, NaN)).toBeCloseTo(0.44);
  expect(smoothMeterLevel(0, -1)).toBe(0);
  expect(smoothMeterLevel(0, 2)).toBe(1);
});
