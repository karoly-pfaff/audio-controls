import { useEffect, useState } from 'react';
import type { RefObject } from 'react';
import type { TimelineWindow } from '../timeline/model/timelineGeometry.ts';

export function useTimelineWindow(
  scroll: RefObject<HTMLDivElement | null>,
  content: RefObject<HTMLDivElement | null>,
): TimelineWindow {
  const [viewport, setViewport] = useState<TimelineWindow>({
    width: 0,
    scrollLeft: 0,
    contentWidth: 0,
  });
  useEffect(() => {
    const surface = scroll.current;
    const track = content.current;
    if (!surface || !track) return;
    return observeTimelineWindow(surface, track, setViewport);
  }, [scroll, content]);
  return viewport;
}

function observeTimelineWindow(
  surface: HTMLDivElement,
  track: HTMLDivElement,
  publish: (viewport: TimelineWindow) => void,
): () => void {
  const synchronize = () => {
    publish({
      width: surface.clientWidth,
      scrollLeft: surface.scrollLeft,
      contentWidth: surface.scrollWidth,
    });
  };
  synchronize();
  const observer = new ResizeObserver(synchronize);
  observer.observe(surface);
  observer.observe(track);
  surface.addEventListener('scroll', synchronize, { passive: true });
  return () => {
    observer.disconnect();
    surface.removeEventListener('scroll', synchronize);
  };
}
