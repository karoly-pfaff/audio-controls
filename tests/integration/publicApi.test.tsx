import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { Slider } from '../../sources/index.ts';
import { TimelineRegionLane } from '../../sources/timeline/index.ts';

it('keeps both public package entries usable by an ordinary host', () => {
  const changeGain = vi.fn();
  const seek = vi.fn();
  render(
    <>
      <Slider label="Gain" value={0.5} onChange={changeGain} />
      <TimelineRegionLane
        regions={[{ id: 'region', start: 5, end: 10, label: 'Section' }]}
        durationSeconds={20}
        onSeek={seek}
      />
    </>,
  );
  fireEvent.change(screen.getByRole('slider'), { target: { value: '0.25' } });
  expect(changeGain).toHaveBeenCalledWith(0.25);
  fireEvent.click(screen.getByRole('button', { name: 'Section' }));
  expect(seek).toHaveBeenCalledWith(5);
});
