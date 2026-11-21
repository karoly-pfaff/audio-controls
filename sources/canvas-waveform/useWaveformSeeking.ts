import type { KeyboardEvent, PointerEvent } from 'react';
import type { CanvasWaveformProps, WaveformHandlers } from './canvasWaveformProps.ts';
import { keyboardDirection } from '../keyboard-input/keyboardDirection.ts';

export function useWaveformSeeking(props: CanvasWaveformProps): WaveformHandlers {
  const enabled = Boolean(props.peaks && props.onSeek);
  return {
    onPointerDown: (event: PointerEvent<HTMLCanvasElement>) => {
      if (!enabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      seekPointer(event, props);
    },
    onPointerMove: (event: PointerEvent<HTMLCanvasElement>) => {
      if (enabled && event.buttons === 1) seekPointer(event, props);
    },
    onKeyDown: (event: KeyboardEvent<HTMLCanvasElement>) => {
      const ratio = keyboardSeekRatio(event.key, props.playhead ?? 0);
      if (!enabled || ratio === null) return;
      event.preventDefault();
      props.onSeek?.(clampRatio(ratio));
    },
  };
}

function seekPointer(event: PointerEvent<HTMLCanvasElement>, props: CanvasWaveformProps): void {
  const rect = event.currentTarget.getBoundingClientRect();
  if (rect.width > 0) props.onSeek?.(clampRatio((event.clientX - rect.left) / rect.width));
}

function clampRatio(ratio: number): number {
  return Math.max(0, Math.min(1, ratio));
}

function keyboardSeekRatio(key: string, current: number): number | null {
  if (key === 'Home') return 0;
  if (key === 'End') return 1;
  const direction = keyboardDirection(key);
  return direction === null ? null : current + direction * 0.01;
}
