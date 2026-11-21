import type { ChangeEventHandler } from 'react';
import type { TimelineZoomProps } from './timelineZoomProps.ts';

export function timelineZoomActions(props: TimelineZoomProps): {
  readonly zoomIn: () => void;
  readonly zoomOut: () => void;
  readonly fit: () => void;
  readonly change: ChangeEventHandler<HTMLInputElement>;
} {
  return {
    zoomIn: () => {
      props.changeZoom(props.zoom + 1);
    },
    zoomOut: () => {
      props.changeZoom(props.zoom - 1);
    },
    fit: () => {
      props.changeZoom(1);
    },
    change: (event) => {
      props.changeZoom(Number(event.target.value));
    },
  };
}
