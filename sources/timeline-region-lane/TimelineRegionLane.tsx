import type { ReactElement } from 'react';
import { timelineRegionStyle } from '../timeline/model/timelineGeometry.ts';

export interface TimelineRegion {
  readonly id: string;
  readonly start: number;
  readonly end: number;
  readonly label: string;
  readonly title?: string | undefined;
}

export function TimelineRegionLane(props: {
  readonly regions: readonly TimelineRegion[];
  readonly durationSeconds: number;
  readonly onSeek: (seconds: number) => void;
  readonly className?: string | undefined;
  readonly label?: string | undefined;
}): ReactElement {
  return (
    <div
      className={props.className ?? 'acr-timeline-regions'}
      aria-label={props.label ?? 'Timeline regions'}
    >
      {props.regions.map((region) => (
        <button
          key={region.id}
          type="button"
          title={region.title}
          style={timelineRegionStyle(region, props.durationSeconds)}
          onClick={() => {
            props.onSeek(region.start);
          }}
        >
          {region.label}
        </button>
      ))}
    </div>
  );
}
