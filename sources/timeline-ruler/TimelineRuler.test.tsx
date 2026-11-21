import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';
import { TimelineRuler } from './TimelineRuler.tsx';

it('renders source-time labels with default and host-provided styling', () => {
  const { rerender } = render(<TimelineRuler duration={60} zoom={1} />);
  expect(screen.getByLabelText('Time ruler')).toHaveClass('acr-timeline-ruler');
  expect(screen.getByText('01:00')).toBeInTheDocument();
  rerender(<TimelineRuler duration={60} zoom={2} className="host-ruler" />);
  expect(screen.getByLabelText('Time ruler')).toHaveClass('host-ruler');
  expect(screen.getByText('00:05')).toBeInTheDocument();
});
