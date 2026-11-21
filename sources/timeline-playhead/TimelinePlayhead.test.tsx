import { render } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TimelinePlayhead } from './TimelinePlayhead.tsx';

it('bounds negative, past-end and unavailable source positions', () => {
  const { container, rerender } = render(
    <TimelinePlayhead positionSeconds={-10} durationSeconds={60} />,
  );
  expect(container.firstChild).toHaveStyle({ left: '0%' });
  rerender(
    <TimelinePlayhead positionSeconds={90} durationSeconds={60} className="host-playhead" />,
  );
  expect(container.firstChild).toHaveClass('host-playhead');
  expect(container.firstChild).toHaveStyle({ left: '100%' });
  rerender(<TimelinePlayhead positionSeconds={10} durationSeconds={0} />);
  expect(container.firstChild).toHaveClass('acr-timeline-playhead');
  expect(container.firstChild).toHaveStyle({ left: '0%' });
});
