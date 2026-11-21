import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { TimelineViewport } from './TimelineViewport.tsx';
import { TimelineZoom } from '../timeline-zoom/TimelineZoom.tsx';

const disconnect = vi.fn();
const observe = vi.fn();
const scrollTo = vi.fn();

beforeEach(() => {
  vi.stubGlobal(
    'ResizeObserver',
    class {
      observe = observe;
      disconnect = disconnect;
    },
  );
  Object.defineProperty(HTMLElement.prototype, 'scrollTo', { value: scrollTo, configurable: true });
});

it('anchors zoom at source time and keeps the viewport independent for each mounted timeline', () => {
  const { unmount } = render(
    <>
      <TimelineViewport
        durationSeconds={60}
        positionSeconds={15}
        toolbar={(view) => <TimelineZoom zoom={view.zoom} changeZoom={view.changeZoom} />}
      >
        {(view) => <output data-testid="first">{view.zoom}</output>}
      </TimelineViewport>
      <TimelineViewport durationSeconds={10} positionSeconds={0}>
        {(view) => <output data-testid="second">{view.zoom}</output>}
      </TimelineViewport>
    </>,
  );
  const [viewport] = screen.getAllByLabelText('Timeline viewport');
  if (!viewport) throw new Error('First viewport was not mounted.');
  Object.defineProperties(viewport, { scrollWidth: { value: 1000 }, clientWidth: { value: 100 } });
  fireEvent.click(screen.getByRole('button', { name: 'Zoom in' }));
  expect(screen.getByTestId('first')).toHaveTextContent('2');
  expect(screen.getByTestId('second')).toHaveTextContent('1');
  expect(scrollTo).toHaveBeenLastCalledWith({ left: 200 });
  fireEvent.click(screen.getByRole('button', { name: 'Fit song' }));
  expect(screen.getByTestId('first')).toHaveTextContent('1');
  unmount();
  expect(disconnect).toHaveBeenCalledTimes(2);
});

it('publishes scroll geometry for bounded waveform and thumbnail rendering', () => {
  render(
    <TimelineViewport durationSeconds={60} positionSeconds={0}>
      {(view) => <output data-testid="window">{JSON.stringify(view.viewport)}</output>}
    </TimelineViewport>,
  );
  const viewport = screen.getByLabelText('Timeline viewport');
  Object.defineProperties(viewport, {
    scrollWidth: { value: 2000 },
    clientWidth: { value: 500 },
    scrollLeft: { value: 750 },
  });
  fireEvent.scroll(viewport);
  expect(JSON.parse(screen.getByTestId('window').textContent)).toEqual({
    width: 500,
    contentWidth: 2000,
    scrollLeft: 750,
  });
});
