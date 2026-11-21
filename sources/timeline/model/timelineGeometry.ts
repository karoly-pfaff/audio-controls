import { formatClockTime } from './formatClockTime.ts';

export interface TimelineWindow {
  readonly width: number;
  readonly scrollLeft: number;
  readonly contentWidth: number;
}

export const MAX_TIMELINE_ZOOM = 32;

export function clampTimelineZoom(zoom: number): number {
  if (!Number.isFinite(zoom)) throw new RangeError('Timeline zoom must be finite.');
  return Math.min(MAX_TIMELINE_ZOOM, Math.max(1, zoom));
}

export function timelineTicks(
  duration: number,
  zoom: number,
): readonly { readonly seconds: number; readonly percent: number; readonly label: string }[] {
  if (!Number.isFinite(duration) || duration <= 0)
    throw new RangeError('Timeline duration must be positive.');
  const count = Math.min(
    Math.round(6 * clampTimelineZoom(zoom)),
    Math.max(1, Math.floor(duration * 100)),
  );
  return Array.from({ length: count + 1 }, (_, index) => {
    const seconds = (index * duration) / count;
    return {
      seconds,
      percent: (index * 100) / count,
      label: formatTimelineTime(seconds, duration / count < 1),
    };
  });
}

export function formatTimelineTime(seconds: number, fractional: boolean): string {
  const label = formatClockTime(seconds);
  if (!fractional) return label;
  const centiseconds = Math.round(seconds * 100);
  return (
    formatClockTime(Math.floor(centiseconds / 100)) +
    '.' +
    String(centiseconds % 100).padStart(2, '0')
  );
}

export function timelineRegionStyle(
  region: { readonly start: number; readonly end: number },
  duration: number,
): { readonly left: string; readonly width: string } {
  return {
    left: String((region.start / duration) * 100) + '%',
    width: String(((region.end - region.start) / duration) * 100) + '%',
  };
}

export function isTimelineRegionVisible(
  region: { readonly start: number; readonly end: number },
  viewport: TimelineWindow,
  duration: number,
): boolean {
  const start = (region.start / duration) * viewport.contentWidth;
  const width = ((region.end - region.start) / duration) * viewport.contentWidth;
  return (
    width > 0 &&
    start + width >= viewport.scrollLeft - 64 &&
    start <= viewport.scrollLeft + viewport.width + 64
  );
}
