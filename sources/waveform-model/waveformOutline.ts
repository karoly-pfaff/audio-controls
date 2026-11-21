import type { waveformWindow } from './waveformWindow.ts';

/** A closed source-time envelope: retain each aggregated extremum without smoothing peaks. */
export function waveformOutline(wave: ReturnType<typeof waveformWindow>): string {
  if (wave.columns.length === 0) return '';
  const width = wave.length / wave.columns.length;
  const upper = wave.columns.flatMap((column, index) =>
    waveformEdge(wave.offset + index * width, width, (1 - column.maximum) * 50),
  );
  const lower = wave.columns.flatMap((column, index) =>
    waveformEdge(wave.offset + index * width, width, (1 - column.minimum) * 50),
  );
  return 'M' + upper.join('L') + 'L' + lower.slice().reverse().join('L') + 'Z';
}

function waveformEdge(start: number, width: number, height: number): readonly string[] {
  return [String(start) + ' ' + String(height), String(start + width) + ' ' + String(height)];
}
