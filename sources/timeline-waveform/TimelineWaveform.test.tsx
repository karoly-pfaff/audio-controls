import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TimelineWaveform } from './TimelineWaveform.tsx';

it('ignores zero-width pointer input and supports an observation-only host', () => {
  const onSeek = vi.fn();
  const props = {
    peaks: { minimum: [-1], maximum: [1] },
    viewport: { width: 100, contentWidth: 100, scrollLeft: 0 },
    durationSeconds: 60,
  };
  const { rerender } = render(<TimelineWaveform {...props} onSeek={onSeek} />);
  const waveform = screen.getByRole('img', { name: 'Audio waveform' });
  fireEvent.click(waveform, { clientX: 20 });
  expect(onSeek).not.toHaveBeenCalled();
  vi.spyOn(waveform, 'getBoundingClientRect').mockReturnValue({ left: 0, width: 100 } as DOMRect);
  rerender(<TimelineWaveform {...props} label="Observed audio" className="host-waveform" />);
  fireEvent.click(screen.getByRole('img', { name: 'Observed audio' }), { clientX: 20 });
  expect(onSeek).not.toHaveBeenCalled();
});

it('seeks on the complete source-time axis even when only a zoomed window is drawn', () => {
  const onSeek = vi.fn();
  render(
    <TimelineWaveform
      durationSeconds={60}
      onSeek={onSeek}
      peaks={{ minimum: [-1, -0.5, 0], maximum: [1, 0.5, 0] }}
      viewport={{ width: 50, contentWidth: 200, scrollLeft: 100 }}
    />,
  );
  const waveform = screen.getByRole('img', { name: 'Audio waveform' });
  vi.spyOn(waveform, 'getBoundingClientRect').mockReturnValue({
    left: -100,
    width: 200,
  } as DOMRect);
  fireEvent.click(waveform, { clientX: 50 });
  expect(onSeek).toHaveBeenCalledWith(45);
});

it('shows an explicit unavailable state instead of inventing audio data', () => {
  render(
    <TimelineWaveform
      durationSeconds={60}
      peaks={{ minimum: [], maximum: [] }}
      viewport={{ width: 0, contentWidth: 0, scrollLeft: 0 }}
    />,
  );
  expect(screen.getByRole('status')).toHaveTextContent('Waveform unavailable');
});
