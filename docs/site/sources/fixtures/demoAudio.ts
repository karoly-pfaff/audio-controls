import type { WaveformPeaks } from '@karoly-pfaff/audio-controls-react';
import type { TimelineRegion } from '@karoly-pfaff/audio-controls-react/timeline';

export const DEMO_DURATION = 120;

const amplitudes = Array.from({ length: 768 }, (_, index) => {
  const envelope = 0.12 + 0.52 * Math.abs(Math.sin(index / 83));
  return envelope * (0.3 + 0.7 * Math.abs(Math.sin(index * 1.7)));
});

export const DEMO_PEAKS: WaveformPeaks = {
  minimum: amplitudes.map((amplitude) => -amplitude),
  maximum: amplitudes,
};

export const DEMO_REGIONS: readonly TimelineRegion[] = [
  { id: 'intro', start: 0, end: 24, label: 'Intro', title: '0:00–0:24' },
  { id: 'verse', start: 24, end: 60, label: 'Verse', title: '0:24–1:00' },
  { id: 'chorus', start: 60, end: 96, label: 'Chorus', title: '1:00–1:36' },
  { id: 'outro', start: 96, end: 120, label: 'Outro', title: '1:36–2:00' },
];

export function readDemoLevels(): { readonly left: number; readonly right: number } {
  const seconds = performance.now() / 1000;
  return {
    left: 0.12 + 0.7 * Math.abs(Math.sin(seconds * 2.1)),
    right: 0.1 + 0.6 * Math.abs(Math.sin(seconds * 2.7)),
  };
}
