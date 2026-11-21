import type { ReactElement } from 'react';
import type { knobGeometry } from './knobGeometry.ts';

const ARC_STYLE = { fill: 'none', strokeWidth: 2.5, strokeLinecap: 'round' } as const;

export function KnobFace(props: {
  readonly geometry: ReturnType<typeof knobGeometry>;
  readonly value: number;
  readonly text: string;
}): ReactElement {
  return (
    <>
      <path
        d={props.geometry.track}
        {...ARC_STYLE}
        stroke="var(--acr-border, var(--border-soft, #64748b))"
      />
      {props.value !== 0 && (
        <path
          d={props.geometry.active}
          {...ARC_STYLE}
          stroke="var(--acr-accent, var(--accent-blue, #8ba8ee))"
        />
      )}
      <circle
        cx={props.geometry.dot[0].toFixed(2)}
        cy={props.geometry.dot[1].toFixed(2)}
        r="2.5"
        fill="var(--acr-text, var(--text-primary, #f1f5f9))"
      />
      <text x={16} y={16} className="knob-value-text">
        {props.text}
      </text>
    </>
  );
}
