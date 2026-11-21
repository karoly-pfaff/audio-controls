import { useMemo } from 'react';
import type { ReactElement, MouseEvent } from 'react';
import type { WaveformPeaks } from '../waveform-model/waveformPeaks.ts';
import type { TimelineWindow } from '../timeline/model/timelineGeometry.ts';
import { waveformWindow } from '../waveform-model/waveformWindow.ts';
import { waveformOutline } from '../waveform-model/waveformOutline.ts';

export interface TimelineWaveformProps {
  readonly peaks: WaveformPeaks;
  readonly viewport: TimelineWindow;
  readonly durationSeconds: number;
  readonly onSeek?: ((seconds: number) => void) | undefined;
  readonly className?: string | undefined;
  readonly label?: string | undefined;
}

export function TimelineWaveform(props: TimelineWaveformProps): ReactElement {
  const wave = useMemo(
    () => waveformWindow(props.peaks, props.viewport),
    [props.peaks, props.viewport],
  );
  if (!wave.total) return <p role="status">Waveform unavailable; use the source-time controls.</p>;
  return (
    <svg
      role="img"
      aria-label={props.label ?? 'Audio waveform'}
      viewBox={'0 0 ' + String(wave.total) + ' 100'}
      preserveAspectRatio="none"
      className={props.className ?? 'acr-timeline-waveform'}
      onClick={(event) => {
        seekWaveform(event, props);
      }}
    >
      <path
        d={waveformOutline(wave)}
        fill="var(--acr-waveform, var(--studio-muted, currentColor))"
      />
    </svg>
  );
}

function seekWaveform(event: MouseEvent<SVGSVGElement>, props: TimelineWaveformProps): void {
  const bounds = event.currentTarget.getBoundingClientRect();
  if (bounds.width <= 0) return;
  props.onSeek?.(
    Math.max(0, Math.min(1, (event.clientX - bounds.left) / bounds.width)) * props.durationSeconds,
  );
}
