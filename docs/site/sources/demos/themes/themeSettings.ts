import type { CSSProperties } from 'react';

export type ThemeKind = 'light' | 'dark';

type ThemeStyle = CSSProperties &
  Partial<Record<'--acr-accent' | '--acr-on-accent' | '--acr-waveform' | '--acr-radius', string>>;

export interface ThemeSettingsModel {
  readonly custom: boolean;
  readonly setCustom: (value: boolean) => void;
  readonly accent: string;
  readonly setAccent: (value: string) => void;
  readonly radius: number;
  readonly setRadius: (value: number) => void;
  readonly style: ThemeStyle;
  readonly waveformColor: string;
}
