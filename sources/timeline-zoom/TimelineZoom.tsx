import { useId } from 'react';
import type { ReactElement } from 'react';
import type { TimelineZoomProps } from './timelineZoomProps.ts';
import { timelineZoomActions } from './timelineZoomActions.ts';
import { MAX_TIMELINE_ZOOM } from '../timeline/model/timelineGeometry.ts';

export function TimelineZoom(props: TimelineZoomProps): ReactElement {
  const id = useId();
  const actions = timelineZoomActions(props);
  return (
    <div className="acr-timeline-zoom" role="group" aria-label="Timeline zoom controls">
      <button
        type="button"
        aria-label="Zoom out"
        disabled={props.zoom <= 1}
        onClick={actions.zoomOut}
      >
        −
      </button>
      <label htmlFor={id}>Timeline zoom</label>
      <input
        id={id}
        type="range"
        min={1}
        max={MAX_TIMELINE_ZOOM}
        step={1}
        value={props.zoom}
        onChange={actions.change}
      />
      <button
        type="button"
        aria-label="Zoom in"
        disabled={props.zoom >= MAX_TIMELINE_ZOOM}
        onClick={actions.zoomIn}
      >
        +
      </button>
      <button type="button" onClick={actions.fit}>
        Fit song
      </button>
    </div>
  );
}
