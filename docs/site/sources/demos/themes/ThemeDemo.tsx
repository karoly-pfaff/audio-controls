import type { ReactElement } from 'react';
import { ThemePanel } from './ThemePanel.tsx';

export function ThemeDemo(): ReactElement {
  return (
    <div className="theme-comparison">
      <ThemePanel theme="light" />
      <ThemePanel theme="dark" />
    </div>
  );
}
