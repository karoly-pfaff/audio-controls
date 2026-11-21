import { useEffect, useRef } from 'react';
import type { RefObject } from 'react';
import { smoothMeterLevel } from './meterLevels.ts';
import type { StereoLevels } from './meterLevels.ts';

export function useStereoMeter(
  playing: boolean,
  readLevels: () => StereoLevels,
): { readonly left: RefObject<HTMLDivElement>; readonly right: RefObject<HTMLDivElement> } {
  const left = useRef<HTMLDivElement>(null);
  const right = useRef<HTMLDivElement>(null);
  const levels = useRef<StereoLevels>({ left: 0, right: 0 });
  useEffect(() => {
    let frame = 0;
    const tick = () => {
      const raw = readLevels();
      const next = {
        left: smoothMeterLevel(levels.current.left, raw.left),
        right: smoothMeterLevel(levels.current.right, raw.right),
      };
      levels.current = next;
      if (left.current) left.current.style.width = String(next.left * 100) + '%';
      if (right.current) right.current.style.width = String(next.right * 100) + '%';
      if (playing || next.left > 0.001 || next.right > 0.001) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [playing, readLevels]);
  return { left, right };
}
