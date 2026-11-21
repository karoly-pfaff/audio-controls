import type { ReactElement } from 'react';
import type { ThemeSettingsModel } from './themeSettings.ts';

export function ThemeColorField(props: ThemeSettingsModel): ReactElement {
  return (
    <label>
      Accent
      <input
        type="color"
        value={props.accent}
        disabled={!props.custom}
        onChange={(event) => {
          props.setAccent(event.target.value);
        }}
      />
      <code>{props.accent}</code>
    </label>
  );
}
