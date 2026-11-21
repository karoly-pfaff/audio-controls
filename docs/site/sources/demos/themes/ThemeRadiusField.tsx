import type { ReactElement } from 'react';
import type { ThemeSettingsModel } from './themeSettings.ts';

export function ThemeRadiusField(props: ThemeSettingsModel): ReactElement {
  return (
    <label>
      Corner radius: {props.radius}px
      <input
        type="range"
        min={0}
        max={16}
        value={props.radius}
        disabled={!props.custom}
        onChange={(event) => {
          props.setRadius(Number(event.target.value));
        }}
      />
    </label>
  );
}
