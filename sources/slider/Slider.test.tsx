import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Slider } from './Slider.tsx';

describe('Slider', () => {
  it('formats decibels, pan, percentages, and accessible labels', () => {
    const onChange = vi.fn();
    const { rerender } = render(<Slider label="Volume" value={0} unit="dB" onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '-∞');
    rerender(<Slider label="Volume" value={0.5} unit="dB" onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '-6.0 dB');
    rerender(<Slider label="Pan" value={0} unit="L/R" onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'C');
    rerender(<Slider label="Pan" value={-0.4} unit="L/R" onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'L40');
    rerender(<Slider label="Pan" value={0.25} unit="L/R" onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', 'R25');
    rerender(
      <Slider
        label="Mix"
        value={0.7}
        onChange={onChange}
        showLabel={false}
        accessibleLabel="Custom mix"
      />,
    );
    expect(screen.getByRole('slider', { name: 'Custom mix' })).toHaveAttribute(
      'aria-valuetext',
      '70%',
    );
    expect(screen.queryByText('Mix')).toBeNull();
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.35' } });
    expect(onChange).toHaveBeenLastCalledWith(0.35);
  });

  it('falls back to the value when no label is supplied', () => {
    render(<Slider label="" value={0.25} onChange={vi.fn()} />);
    expect(screen.getByRole('slider', { name: '25%' })).toBeInTheDocument();
  });
});
