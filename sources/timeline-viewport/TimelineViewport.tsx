import { useRef } from 'react';
import type { ReactElement, ReactNode } from 'react';
import type { TimelineWindow } from '../timeline/model/timelineGeometry.ts';
import { useTimelineWindow } from './useTimelineWindow.ts';
import { useTimelineZoom } from './useTimelineZoom.ts';

export interface TimelineView {
  readonly zoom: number;
  readonly changeZoom: (zoom: number) => void;
  readonly viewport: TimelineWindow;
}

export interface TimelineViewportProps {
  readonly durationSeconds: number;
  readonly positionSeconds: number;
  readonly children: (view: TimelineView) => ReactNode;
  readonly toolbar?: ((view: TimelineView) => ReactNode) | undefined;
  readonly scrollClassName?: string | undefined;
  readonly contentClassName?: string | undefined;
  readonly label?: string | undefined;
}

export function TimelineViewport(props: TimelineViewportProps): ReactElement {
  const scroll = useRef<HTMLDivElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const zoom = useTimelineZoom(scroll, props.durationSeconds, props.positionSeconds);
  const viewport = useTimelineWindow(scroll, content);
  const view = { zoom: zoom.value, changeZoom: zoom.change, viewport };
  return (
    <>
      {props.toolbar?.(view)}
      <div
        ref={scroll}
        className={props.scrollClassName ?? 'acr-timeline-scroll'}
        aria-label={props.label ?? 'Timeline viewport'}
        tabIndex={0}
      >
        <div
          ref={content}
          className={props.contentClassName ?? 'acr-timeline-content'}
          style={{ width: String(view.zoom * 100) + '%' }}
        >
          {props.children(view)}
        </div>
      </div>
    </>
  );
}
