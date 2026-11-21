import type { WaveformPeaks } from './waveformPeaks.ts';
import type { TimelineWindow } from '../timeline/model/timelineGeometry.ts';
import { waveformColumns } from './waveformColumns.ts';

export function waveformWindow(
  peaks: WaveformPeaks,
  viewport: TimelineWindow,
): {
  readonly offset: number;
  readonly length: number;
  readonly total: number;
  readonly columns: ReturnType<typeof waveformColumns>;
} {
  const [start, end] = waveformSampleRange(peaks.maximum.length, viewport);
  const visible = {
    ...peaks,
    minimum: peaks.minimum.slice(start, end),
    maximum: peaks.maximum.slice(start, end),
  };
  return {
    offset: start,
    length: end - start,
    total: peaks.maximum.length,
    columns: waveformColumns(visible),
  };
}

function waveformSampleRange(count: number, viewport: TimelineWindow): readonly [number, number] {
  if (viewport.contentWidth <= 0) return [0, count];
  const start = Math.max(
    0,
    Math.floor(((viewport.scrollLeft - 64) / viewport.contentWidth) * count),
  );
  const end = Math.min(
    count,
    Math.ceil(((viewport.scrollLeft + viewport.width + 64) / viewport.contentWidth) * count),
  );
  return [start, end];
}
