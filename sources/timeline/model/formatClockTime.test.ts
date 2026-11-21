import { expect, it } from 'vitest';
import { formatClockTime } from './formatClockTime.ts';

it.each([-1, NaN, Infinity])('rejects invalid source seconds %s', (seconds) => {
  expect(() => formatClockTime(seconds)).toThrow(RangeError);
});

it('formats minute and hour boundaries without accumulating frame time', () => {
  expect(formatClockTime(65.9)).toBe('01:05');
  expect(formatClockTime(3661)).toBe('01:01:01');
});
