import type { ReactElement } from 'react';

export function TimelinePlayhead(props: {
  readonly positionSeconds: number;
  readonly durationSeconds: number;
  readonly className?: string | undefined;
}): ReactElement {
  const ratio = props.durationSeconds > 0 ? props.positionSeconds / props.durationSeconds : 0;
  return (
    <div
      className={props.className ?? 'acr-timeline-playhead'}
      aria-hidden="true"
      style={{ left: String(Math.max(0, Math.min(1, ratio)) * 100) + '%' }}
    />
  );
}
