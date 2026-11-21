import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import { clampTimelineZoom } from '../timeline/model/timelineGeometry.ts';

export function useTimelineZoom(
  scroll: RefObject<HTMLDivElement | null>,
  duration: number,
  seconds: number,
): { readonly value: number; readonly change: (zoom: number) => void } {
  const [view, setView] = useState({ zoom: 1, anchor: 0 });
  useEffect(() => {
    const surface = scroll.current;
    surface?.scrollTo({
      left: Math.max(0, (view.anchor / duration) * surface.scrollWidth - surface.clientWidth / 2),
    });
  }, [scroll, duration, view]);
  return {
    value: view.zoom,
    change: (zoom) => {
      setView({ zoom: clampTimelineZoom(zoom), anchor: seconds });
    },
  };
}
