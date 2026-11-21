import type { ReactElement } from 'react';
import type { ThemeKind } from './themeSettings.ts';
import { useThemeSettings } from './useThemeSettings.ts';
import { ThemeSettings } from './ThemeSettings.tsx';
import { ThemePreview } from './ThemePreview.tsx';

export function ThemePanel(props: { readonly theme: ThemeKind }): ReactElement {
  const settings = useThemeSettings(props.theme);
  return (
    <div
      data-acr-theme={props.theme}
      style={settings.style}
      className="theme-panel"
      role="group"
      aria-label={props.theme + ' theme preview'}
    >
      <h4>{props.theme === 'light' ? 'Light theme' : 'Dark theme'}</h4>
      <ThemeSettings {...settings} />
      <ThemePreview color={settings.waveformColor} />
    </div>
  );
}
