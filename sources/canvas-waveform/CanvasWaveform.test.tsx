import { createCanvasContext } from '../../tests/canvasContext.ts';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { CanvasWaveform } from './CanvasWaveform.tsx';

it('ignores unavailable seeking and zero-size surfaces, and supports every arrow direction', () => {
  const onSeek = vi.fn<(ratio: number) => void>();
  const { container, rerender } = render(<CanvasWaveform peaks={null} onSeek={onSeek} />);
  const canvas = container.querySelector('canvas');
  if (!canvas) throw new Error('Canvas was not mounted.');
  canvas.setPointerCapture = vi.fn();
  fireEvent.pointerDown(canvas);
  fireEvent.pointerMove(canvas, { buttons: 1 });
  fireEvent.keyDown(canvas, { key: 'Home' });
  expect(onSeek).not.toHaveBeenCalled();
  rerender(<CanvasWaveform peaks={peaks} onSeek={onSeek} playhead={0.5} />);
  fireEvent.pointerDown(canvas, { pointerId: 1 });
  fireEvent.keyDown(canvas, { key: 'Enter' });
  expect(onSeek).not.toHaveBeenCalled();
  fireEvent.keyDown(canvas, { key: 'ArrowLeft' });
  fireEvent.keyDown(canvas, { key: 'ArrowDown' });
  fireEvent.keyDown(canvas, { key: 'ArrowUp' });
  expect(onSeek.mock.calls).toEqual([[0.49], [0.49], [0.51]]);
});

it('reuses the background for playhead movement and invalidates it for replacement peaks', () => {
  const fixture = createCanvasContext();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fixture.drawingContext);
  const { rerender } = render(<CanvasWaveform peaks={peaks} playhead={0} />);
  rerender(<CanvasWaveform peaks={peaks} playhead={0.5} />);
  expect(fixture.context.createLinearGradient).toHaveBeenCalledTimes(2);
  rerender(<CanvasWaveform peaks={{ ...peaks }} playhead={0.5} />);
  expect(fixture.context.createLinearGradient).toHaveBeenCalledTimes(4);
});

it('renders custom size, color and ticks while rejecting playheads outside the track', () => {
  const { rerender } = render(
    <CanvasWaveform
      peaks={peaks}
      width={130}
      height={20}
      color="#123456"
      tickDurationSeconds={65}
      playhead={-1}
      accessibleLabel="Scrub"
      onSeek={vi.fn()}
    />,
  );
  expect(screen.getByRole('slider', { name: 'Scrub' })).toHaveAttribute('width', '130');
  rerender(<CanvasWaveform peaks={peaks} playhead={2} interactive={false} />);
  expect(screen.queryByRole('slider')).toBeNull();
});

const peaks = { minimum: [-0.5, 0], maximum: [0.5, 1] };

beforeEach(() => {
  vi.stubGlobal('PointerEvent', MouseEvent);
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
    createCanvasContext().drawingContext,
  );
});

it('provides clamped pointer and keyboard seeks without owning playback state', () => {
  const onSeek = vi.fn<(ratio: number) => void>();
  render(<CanvasWaveform peaks={peaks} playhead={0.5} onSeek={onSeek} />);
  const canvas = screen.getByRole('slider');
  canvas.setPointerCapture = vi.fn();
  vi.spyOn(canvas, 'getBoundingClientRect').mockReturnValue({ left: 10, width: 100 } as DOMRect);
  fireEvent.pointerDown(canvas, { clientX: -20, pointerId: 1 });
  fireEvent.pointerMove(canvas, { clientX: 150, buttons: 1 });
  fireEvent.pointerMove(canvas, { clientX: 60, buttons: 0 });
  fireEvent.keyDown(canvas, { key: 'ArrowRight' });
  fireEvent.keyDown(canvas, { key: 'Home' });
  fireEvent.keyDown(canvas, { key: 'End' });
  expect(onSeek.mock.calls.map(([value]) => value)).toEqual([0, 1, 0.51, 0, 1]);
});

it('lets host selection handlers own interaction instead of dispatching a second seek', () => {
  const onSeek = vi.fn();
  const select = vi.fn();
  render(<CanvasWaveform peaks={peaks} onSeek={onSeek} handlers={{ onPointerDown: select }} />);
  fireEvent.pointerDown(screen.getByRole('slider'));
  expect(select).toHaveBeenCalledOnce();
  expect(onSeek).not.toHaveBeenCalled();
});

it('invalidates the cached waveform when its height changes', () => {
  const fixture = createCanvasContext();
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(fixture.drawingContext);
  const { rerender } = render(<CanvasWaveform peaks={peaks} height={24} />);
  expect(fixture.context.createLinearGradient).toHaveBeenCalledTimes(2);
  rerender(<CanvasWaveform peaks={peaks} height={48} />);
  expect(fixture.context.createLinearGradient).toHaveBeenCalledTimes(4);
});

it('handles unavailable drawing contexts and noninteractive empty tracks', () => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(null);
  render(<CanvasWaveform peaks={null} onSeek={vi.fn()} />);
  expect(screen.queryByRole('slider')).toBeNull();
});
