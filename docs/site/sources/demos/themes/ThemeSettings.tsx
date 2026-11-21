import type { ReactElement } from 'react';
import type { ThemeSettingsModel } from './themeSettings.ts';
import { ThemeColorField } from './ThemeColorField.tsx';
import { ThemeRadiusField } from './ThemeRadiusField.tsx';

export function ThemeSettings(props: ThemeSettingsModel): ReactElement {
  return (
    <fieldset className="theme-settings">
      <legend>Theme settings</legend>
      <label>
        <input
          type="checkbox"
          checked={props.custom}
          onChange={(event) => {
            props.setCustom(event.target.checked);
          }}
        />
        Customize tokens
      </label>
      <ThemeColorField {...props} />
      <ThemeRadiusField {...props} />
    </fieldset>
  );
}
