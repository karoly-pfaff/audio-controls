import { renderHook } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { useStereoMeter } from './useStereoMeter.ts';

it.each([
  { left: 0, right: 0 },
  { left: 1, right: 0 },
  { left: 0, right: 1 },
])('handles detached bars, decay and an idle output tap %o', (levels) => {
  let tick: FrameRequestCallback | undefined;
  const schedule = vi.fn((callback: FrameRequestCallback) => {
    tick = callback;
    return 1;
  });
  const cancel = vi.fn();
  vi.stubGlobal('requestAnimationFrame', schedule);
  vi.stubGlobal('cancelAnimationFrame', cancel);
  const readLevels = () => levels;
  const { unmount } = renderHook(() => useStereoMeter(false, readLevels));
  tick?.(0);
  expect(schedule).toHaveBeenCalledTimes(levels.left + levels.right > 0 ? 2 : 1);
  unmount();
  expect(cancel).toHaveBeenCalledWith(1);
});
