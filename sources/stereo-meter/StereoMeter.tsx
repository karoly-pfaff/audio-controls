import type { ReactElement } from 'react';
import type { StereoLevels } from './meterLevels.ts';
import { useStereoMeter } from './useStereoMeter.ts';
import { StereoMeterRow } from './StereoMeterRow.tsx';

export function StereoMeter(props: {
  readonly playing: boolean;
  readonly readLevels: () => StereoLevels;
}): ReactElement {
  const refs = useStereoMeter(props.playing, props.readLevels);
  return (
    <div className="acr-stereo-meter stereo-meter" aria-hidden="true">
      <StereoMeterRow label="L" barRef={refs.left} />
      <StereoMeterRow label="R" barRef={refs.right} />
    </div>
  );
}
