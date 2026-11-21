import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TimelineZoom } from './TimelineZoom.tsx';

it('forwards zoom, fit and keyboard-range input while disabling the bounds', () => {
  const changeZoom = vi.fn();
  const { rerender } = render(<TimelineZoom zoom={1} changeZoom={changeZoom} />);
  expect(screen.getByRole('button', { name: 'Zoom out' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(changeZoom).toHaveBeenLastCalledWith(2);
  fireEvent.change(screen.getByRole('slider', { name: 'Timeline zoom' }), {
    target: { value: '8' },
  });
  expect(changeZoom).toHaveBeenLastCalledWith(8);
  fireEvent.click(screen.getByRole('button', { name: 'Fit song' }));
  expect(changeZoom).toHaveBeenLastCalledWith(1);
  rerender(<TimelineZoom zoom={32} changeZoom={changeZoom} />);
  expect(screen.getByRole('button', { name: 'Zoom in' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Zoom out' }));
  expect(changeZoom).toHaveBeenLastCalledWith(31);
});
