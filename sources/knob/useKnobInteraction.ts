import { useRef } from 'react';
import type { PointerEvent, DOMAttributes } from 'react';
import type { KnobProps } from './knobProps.ts';
import { pointerKnobValue } from './knobGeometry.ts';
import { knobBounds } from './knobBounds.ts';
import { createKnobKeyboard } from './createKnobKeyboard.ts';

type KnobHandlers = Required<
  Pick<
    DOMAttributes<SVGSVGElement>,
    | 'onPointerDown'
    | 'onPointerMove'
    | 'onPointerUp'
    | 'onPointerCancel'
    | 'onBlur'
    | 'onDoubleClick'
    | 'onKeyDown'
  >
>;

export function useKnobInteraction(props: KnobProps): KnobHandlers {
  const drag = useRef<{ startY: number; startVal: number } | null>(null);
  const bounds = knobBounds(props);
  const change = (value: number) => {
    props.onChange(Math.max(bounds.min, Math.min(bounds.max, value)));
  };
  const release = () => {
    drag.current = null;
  };
  return {
    onPointerDown: (event: PointerEvent<SVGSVGElement>) => {
      if (props.disabled) return;
      event.currentTarget.setPointerCapture(event.pointerId);
      const rect = event.currentTarget.getBoundingClientRect();
      const horizontal = ((event.clientX - rect.left) * 32) / rect.width - 16;
      const vertical = ((event.clientY - rect.top) * 32) / rect.height - 16;
      const startVal =
        Math.hypot(horizontal, vertical) > 4
          ? pointerKnobValue(horizontal, vertical, bounds)
          : props.value;
      if (Math.hypot(horizontal, vertical) > 4) change(Number(startVal.toFixed(10)));
      drag.current = { startY: event.clientY, startVal };
    },
    onPointerMove: (event: PointerEvent<SVGSVGElement>) => {
      if (!drag.current || event.buttons !== 1 || props.disabled) return;
      const delta = ((drag.current.startY - event.clientY) * (bounds.max - bounds.min)) / 120;
      change(Math.round((drag.current.startVal + delta) / bounds.step) * bounds.step);
    },
    onPointerUp: release,
    onPointerCancel: release,
    onBlur: release,
    onDoubleClick: () => {
      if (!props.disabled) change(0);
    },
    onKeyDown: createKnobKeyboard(props, { bounds, change }),
  };
}
