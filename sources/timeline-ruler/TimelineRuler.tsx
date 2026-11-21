import type { JSX } from 'react';
import { timelineTicks } from '../timeline/model/timelineGeometry.ts';

export function TimelineRuler(props: {
  readonly duration: number;
  readonly zoom: number;
  readonly className?: string | undefined;
}): JSX.Element {
  return (
    <div className={props.className ?? 'acr-timeline-ruler'} aria-label="Time ruler">
      {timelineTicks(props.duration, props.zoom).map((tick) => (
        <span key={tick.seconds} style={{ left: String(tick.percent) + '%' }}>
          {tick.label}
        </span>
      ))}
    </div>
  );
}
