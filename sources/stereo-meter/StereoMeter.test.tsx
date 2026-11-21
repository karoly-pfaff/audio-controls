import { render } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { StereoMeter } from './StereoMeter.tsx';

it('reads the supplied output tap and cancels animation on unmount', () => {
  let frame: FrameRequestCallback | undefined;
  vi.stubGlobal(
    'requestAnimationFrame',
    vi.fn((callback: FrameRequestCallback) => {
      frame = callback;
      return 42;
    }),
  );
  const cancel = vi.fn();
  vi.stubGlobal('cancelAnimationFrame', cancel);
  const readLevels = vi.fn(() => ({ left: 1, right: 0 }));
  const { container, unmount } = render(<StereoMeter playing readLevels={readLevels} />);
  frame?.(0);
  expect(readLevels).toHaveBeenCalledOnce();
  expect(container.querySelector('.stereo-meter-bar')).toHaveStyle({ width: '70%' });
  unmount();
  expect(cancel).toHaveBeenCalledWith(42);
});
