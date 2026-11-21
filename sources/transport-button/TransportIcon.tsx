import type { ReactElement } from 'react';

export type TransportIconKind = 'restart' | 'back' | 'play' | 'pause' | 'stop' | 'forward';

const PATHS = {
  restart: 'M6 6h2v12H6zm3.5 6 8.5 6V6z',
  back: 'M11 18V6l-8.5 6 8.5 6zm.5-6 8.5 6V6l-8.5 6z',
  play: 'M8 5v14l11-7z',
  pause: 'M6 4h4v16H6zM14 4h4v16h-4z',
  stop: 'M5 5h14v14H5z',
  forward: 'M4 18l8.5-6L4 6v12zm9-12v12l8.5-6L13 6z',
} as const;

const SIZES = { restart: 16, back: 16, forward: 16, play: 20, pause: 20, stop: 18 } as const;

export function TransportIcon({ kind }: { readonly kind: TransportIconKind }): ReactElement {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      width={SIZES[kind]}
      height={SIZES[kind]}
      aria-hidden="true"
    >
      <path d={PATHS[kind]} />
    </svg>
  );
}
