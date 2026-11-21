import { renderHook } from '@testing-library/react';
import { expect, it } from 'vitest';
import { useTimelineWindow } from './useTimelineWindow.ts';

it('does not observe surfaces until both source-time elements are attached', () => {
  const element = document.createElement('div');
  const detached = renderHook(() => useTimelineWindow({ current: null }, { current: element }));
  expect(detached.result.current).toEqual({ width: 0, scrollLeft: 0, contentWidth: 0 });
  detached.unmount();
  const missingContent = renderHook(() =>
    useTimelineWindow({ current: element }, { current: null }),
  );
  expect(missingContent.result.current.contentWidth).toBe(0);
});
