import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TransportControls } from './TransportControls.tsx';

function transportProps() {
  return {
    playing: false,
    disabled: false,
    playable: true,
    play: vi.fn(),
    pause: vi.fn(),
    stop: vi.fn(),
    seekToStart: vi.fn(),
    jumpBack: vi.fn(),
    jumpForward: vi.fn(),
  };
}

it('operates every transport action and switches play to pause', () => {
  const props = transportProps();
  const { rerender } = render(<TransportControls {...props} />);
  expect(screen.getByTitle('Jump back 5s (←)')).toHaveClass('transport-btn--jump');
  fireEvent.click(screen.getByTitle('Restart from beginning (Home)'));
  fireEvent.click(screen.getByTitle('Jump back 5s (←)'));
  fireEvent.click(screen.getByTitle('Play (Space)'));
  fireEvent.click(screen.getByTitle('Stop (Esc)'));
  fireEvent.click(screen.getByTitle('Jump forward 5s (→)'));
  expect(props.seekToStart).toHaveBeenCalledOnce();
  expect(props.jumpBack.mock.calls).toEqual([[]]);
  expect(props.play).toHaveBeenCalledOnce();
  expect(props.stop).toHaveBeenCalledOnce();
  expect(props.jumpForward.mock.calls).toEqual([[]]);
  rerender(<TransportControls {...props} playing />);
  fireEvent.click(screen.getByTitle('Pause (Space)'));
  expect(props.pause).toHaveBeenCalledOnce();
});

it('disables transport actions when unavailable', () => {
  const props = transportProps();
  const { rerender } = render(<TransportControls {...props} playable={false} />);
  expect(screen.getByTitle('Play (Space)')).toBeDisabled();
  rerender(<TransportControls {...props} disabled />);
  for (const button of screen.getAllByRole('button')) {
    expect(button).toBeDisabled();
  }
});
