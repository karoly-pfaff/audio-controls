import { vi } from 'vitest';
import type { Mock } from 'vitest';

interface CanvasCalls {
  readonly clearRect: Mock<CanvasRenderingContext2D['clearRect']>;
  readonly beginPath: Mock<() => void>;
  readonly closePath: Mock<() => void>;
  readonly moveTo: Mock<(horizontal: number, vertical: number) => void>;
  readonly lineTo: Mock<(horizontal: number, vertical: number) => void>;
  readonly stroke: Mock<() => void>;
  readonly fill: Mock<() => void>;
  readonly save: Mock<() => void>;
  readonly restore: Mock<() => void>;
  readonly setLineDash: Mock<(segments: number[]) => void>;
  readonly drawImage: Mock<
    (image: CanvasImageSource, horizontal: number, vertical: number) => void
  >;
  readonly createLinearGradient: Mock<CanvasRenderingContext2D['createLinearGradient']>;
}

interface CanvasFixture {
  readonly drawingContext: CanvasRenderingContext2D;
  readonly context: CanvasCalls;
  readonly gradient: { readonly addColorStop: Mock<(offset: number, color: string) => void> };
}

export function createCanvasContext(): CanvasFixture {
  const gradient = { addColorStop: vi.fn<(offset: number, color: string) => void>() };
  const context: CanvasCalls = {
    clearRect: vi.fn(),
    beginPath: vi.fn(),
    closePath: vi.fn(),
    moveTo: vi.fn(),
    lineTo: vi.fn(),
    stroke: vi.fn(),
    fill: vi.fn(),
    save: vi.fn(),
    restore: vi.fn(),
    setLineDash: vi.fn(),
    drawImage: vi.fn(),
    createLinearGradient: vi.fn(() => gradient),
  };
  // The fixture implements every Canvas method used by the waveform paint contract.
  return { drawingContext: context as unknown as CanvasRenderingContext2D, context, gradient };
}
