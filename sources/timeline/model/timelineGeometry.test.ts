import { expect, it } from 'vitest';
import {
  clampTimelineZoom,
  isTimelineRegionVisible,
  timelineTicks,
  timelineRegionStyle,
} from './timelineGeometry.ts';

it('keeps ruler and region positions on the same source-time axis', () => {
  const ticks = timelineTicks(60, 1);
  expect(ticks).toHaveLength(7);
  expect(ticks.at(-1)).toEqual({ seconds: 60, percent: 100, label: '01:00' });
  expect(timelineRegionStyle({ start: 15, end: 30 }, 60)).toEqual({ left: '25%', width: '25%' });
  const fineTicks = timelineTicks(1, 32);
  expect(fineTicks).toHaveLength(101);
  expect(new Set(fineTicks.map((tick) => tick.label)).size).toBe(fineTicks.length);
  expect(clampTimelineZoom(50)).toBe(32);
});

it('rejects invalid source duration or zoom instead of inventing a viewport', () => {
  expect(() => timelineTicks(0, 1)).toThrow(RangeError);
  expect(() => timelineTicks(Infinity, 1)).toThrow(RangeError);
  expect(() => timelineTicks(60, NaN)).toThrow(RangeError);
});

it('bounds offscreen previews while retaining images on narrow visible scenes', () => {
  const viewport = { width: 1440, contentWidth: 1440 * 32, scrollLeft: 20000 };
  const scenes = Array.from({ length: 180 }, (_, index) => ({
    start: index * 10,
    end: (index + 1) * 10,
  }));
  expect(
    scenes.filter((scene) => isTimelineRegionVisible(scene, viewport, 1800)).length,
  ).toBeLessThanOrEqual(8);
  expect(
    isTimelineRegionVisible(
      { start: 0, end: 1 },
      { ...viewport, scrollLeft: 0, contentWidth: 1440 },
      1800,
    ),
  ).toBe(true);
  expect(
    isTimelineRegionVisible(
      { start: 0, end: 20 },
      { ...viewport, scrollLeft: 0, contentWidth: 1440 },
      60,
    ),
  ).toBe(true);
  expect(isTimelineRegionVisible({ start: 0, end: 0 }, viewport, 1800)).toBe(false);
});
