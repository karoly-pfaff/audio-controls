import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ToggleButton } from './ToggleButton.tsx';

it('renders an inactive default toggle and respects disabled input', () => {
  const onClick = vi.fn();
  render(<ToggleButton label="Loop" active={false} onClick={onClick} disabled />);
  const button = screen.getByRole('button', { name: 'Loop' });
  expect(button).toHaveAttribute('aria-pressed', 'false');
  expect(button).toHaveClass('toggle-btn--default');
  fireEvent.click(button);
  expect(onClick).not.toHaveBeenCalled();
});

describe('ToggleButton', () => {
  it('renders active variants and forwards clicks', () => {
    const onClick = vi.fn();
    render(<ToggleButton label="M" active onClick={onClick} variant="mute" ariaLabel="Mute" />);
    const button = screen.getByRole('button', { name: 'Mute' });
    expect(button).toHaveClass('toggle-btn--mute', 'toggle-btn--active');
    expect(button).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledOnce();
  });
});
