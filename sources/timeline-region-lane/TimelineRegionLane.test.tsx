import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { TimelineRegionLane } from './TimelineRegionLane.tsx';

it('seeks through named source regions and supports host labels and styles', () => {
  const onSeek = vi.fn();
  const regions = [{ id: 'intro', start: 10, end: 20, label: 'Intro', title: 'Observed section' }];
  const { rerender } = render(
    <TimelineRegionLane regions={regions} durationSeconds={40} onSeek={onSeek} />,
  );
  expect(screen.getByLabelText('Timeline regions')).toHaveClass('acr-timeline-regions');
  const region = screen.getByRole('button', { name: 'Intro' });
  expect(region).toHaveStyle({ left: '25%', width: '25%' });
  fireEvent.click(region);
  expect(onSeek).toHaveBeenCalledWith(10);
  rerender(
    <TimelineRegionLane
      regions={[]}
      durationSeconds={40}
      onSeek={onSeek}
      label="Sections"
      className="host-lane"
    />,
  );
  expect(screen.getByLabelText('Sections')).toHaveClass('host-lane');
  expect(screen.queryByRole('button')).toBeNull();
});
