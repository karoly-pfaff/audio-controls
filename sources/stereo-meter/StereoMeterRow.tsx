import type { ReactElement, Ref } from 'react';

export function StereoMeterRow({
  label,
  barRef,
}: {
  readonly label: string;
  readonly barRef: Ref<HTMLDivElement>;
}): ReactElement {
  return (
    <div className="stereo-meter-row">
      <span className="stereo-meter-label">{label}</span>
      <div className="stereo-meter-track">
        <div ref={barRef} className="stereo-meter-bar" />
      </div>
    </div>
  );
}
