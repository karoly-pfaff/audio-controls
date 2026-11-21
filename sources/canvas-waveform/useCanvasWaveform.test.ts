import { renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useCanvasWaveform } from './useCanvasWaveform.ts';

it('defers painting while the canvas ref is detached', () => {
  const { result } = renderHook(() => useCanvasWaveform({ peaks: null }));
  expect(result.current.current).toBeNull();
});
