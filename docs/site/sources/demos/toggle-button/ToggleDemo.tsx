import { useState } from 'react';
import type { ReactElement } from 'react';
import { ToggleButton } from '@karoly-pfaff/audio-controls-react';

export function ToggleDemo(): ReactElement {
  const [enabled, setEnabled] = useState({ mute: false, solo: true, loop: false });
  return (
    <div className="demo-row">
      {(['mute', 'solo', 'loop'] as const).map((variant) => (
        <ToggleButton
          key={variant}
          label={variant}
          variant={variant}
          active={enabled[variant]}
          onClick={() => {
            setEnabled({ ...enabled, [variant]: !enabled[variant] });
          }}
        />
      ))}
      <ToggleButton label="Disabled" active={false} disabled onClick={() => undefined} />
    </div>
  );
}
