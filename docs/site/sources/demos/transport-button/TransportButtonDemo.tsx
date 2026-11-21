import { useState } from 'react';
import type { ReactElement } from 'react';
import { TransportButton } from '@karoly-pfaff/audio-controls-react';

export function TransportButtonDemo(): ReactElement {
  const [action, setAction] = useState('none');
  return (
    <div className="demo-stack">
      <div className="demo-row">
        {(['restart', 'back', 'play', 'pause', 'stop', 'forward'] as const).map((icon) => (
          <TransportButton
            key={icon}
            icon={icon}
            label={'Demo ' + icon}
            onClick={() => {
              setAction(icon);
            }}
          />
        ))}
      </div>
      <output>Last action: {action}</output>
    </div>
  );
}
