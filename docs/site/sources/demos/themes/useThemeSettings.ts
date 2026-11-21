import { useState } from 'react';
import type { ThemeKind, ThemeSettingsModel } from './themeSettings.ts';
import { accentText } from './accentText.ts';

const ACCENTS = { light: '#6845d6', dark: '#b49bff' } as const;
const WAVEFORMS = { light: '#b19aee', dark: '#b19aee' } as const;

export function useThemeSettings(theme: ThemeKind): ThemeSettingsModel {
  const [custom, setCustom] = useState(false);
  const [accent, setAccent] = useState<string>(ACCENTS[theme]);
  const [radius, setRadius] = useState(6);
  const style = custom
    ? {
        '--acr-accent': accent,
        '--acr-on-accent': accentText(accent),
        '--acr-waveform': accent,
        '--acr-radius': String(radius) + 'px',
      }
    : {};
  return {
    custom,
    setCustom,
    accent,
    setAccent,
    radius,
    setRadius,
    style,
    waveformColor: custom ? accent : WAVEFORMS[theme],
  };
}
