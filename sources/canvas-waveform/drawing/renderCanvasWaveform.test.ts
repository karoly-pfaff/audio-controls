import { createCanvasContext as createTestContext } from '../../../tests/canvasContext.ts';
import { afterEach, expect, it, vi } from 'vitest';
import { renderCanvasWaveform } from './renderCanvasWaveform.ts';
import { waveformPeaksFromChannels } from '../../waveform-model/waveformPeaksFromChannels.ts';

it('draws source-time ticks and a center baseline for a missing display extremum', () => {
  const fixture = createTestContext();
  useCanvasContext(fixture.drawingContext);
  renderCanvasWaveform({
    peaks: { minimum: [-1, 1], maximum: [] },
    color: '#123456',
    width: 130,
    height: 20,
    tickDurationSeconds: 65,
  });
  expect(fixture.context.moveTo).toHaveBeenCalledWith(60, 0);
  expect(fixture.context.moveTo).toHaveBeenCalledWith(120, 0);
  expect(fixture.context.lineTo).toHaveBeenCalledWith(65, 10);
  expect(fixture.context.restore).toHaveBeenCalledOnce();
});

function asCanvasContext(context: ReturnType<typeof createTestContext>['context']) {
  return context as unknown as CanvasRenderingContext2D;
}

function useCanvasContext(context: CanvasRenderingContext2D | null): void {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(context);
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

it('renders the empty waveform baseline', () => {
  const { context } = createTestContext();
  useCanvasContext(asCanvasContext(context));
  const canvas = renderCanvasWaveform({ peaks: null, color: '#abc', width: 80, height: 20 });
  expect([canvas.width, canvas.height]).toEqual([80, 20]);
  expect(context.setLineDash).toHaveBeenCalledWith([3, 8]);
  expect(context.moveTo).toHaveBeenCalledWith(0, 10);
  expect(context.lineTo).toHaveBeenCalledWith(80, 10);
  expect(context.stroke).toHaveBeenCalledOnce();
});

it('returns the waveform canvas when 2D rendering is unavailable', () => {
  useCanvasContext(null);
  const canvas = renderCanvasWaveform({ peaks: null, color: '#abc', width: 24, height: 12 });
  expect([canvas.width, canvas.height]).toEqual([24, 12]);
});

it('renders filled and stroked waveform envelopes', () => {
  const { context, gradient } = createTestContext();
  useCanvasContext(asCanvasContext(context));
  const channels = [new Float32Array([-1, -0.5, 0.5, 1])];
  renderCanvasWaveform({
    peaks: waveformPeaksFromChannels(channels, { columns: 4, aggregation: 'all-channels' }),
    color: '#123456',
    width: 4,
    height: 20,
  });
  expect(context.createLinearGradient).toHaveBeenCalledTimes(2);
  expect(gradient.addColorStop).toHaveBeenCalledTimes(4);
  expect(context.fill).toHaveBeenCalledTimes(2);
  expect(context.stroke).toHaveBeenCalledOnce();
  expect(context.lineTo).toHaveBeenCalledWith(3, 20);
});

it('renders waveform events that occur outside the first channel', () => {
  const { context } = createTestContext();
  useCanvasContext(asCanvasContext(context));
  const channels = [new Float32Array(4), new Float32Array([0, 0, 0.9, 0])];

  renderCanvasWaveform({
    peaks: waveformPeaksFromChannels(channels, { columns: 4, aggregation: 'all-channels' }),
    color: '#123456',
    width: 4,
    height: 20,
  });

  expect(
    context.lineTo.mock.calls.some(
      ([horizontal, vertical]) => horizontal === 2 && Math.abs(vertical - 19) < 0.001,
    ),
  ).toBe(true);
});

it('renders non-divisible waveforms through the final canvas column', () => {
  const { context } = createTestContext();
  useCanvasContext(asCanvasContext(context));
  const channels = [new Float32Array(801).fill(1)];

  renderCanvasWaveform({
    peaks: waveformPeaksFromChannels(channels, {
      columns: 800,
      aggregation: 'all-channels',
    }),
    color: '#123456',
    width: 800,
    height: 20,
  });

  expect(context.lineTo).toHaveBeenCalledWith(799, 20);
});
