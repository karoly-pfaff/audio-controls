import type { ReactNode } from 'react';

export interface ToggleButtonProps {
  readonly label: ReactNode;
  readonly active: boolean;
  readonly onClick: () => void;
  readonly variant?: 'mute' | 'solo' | 'loop' | 'default' | undefined;
  readonly title?: string | undefined;
  readonly ariaLabel?: string | undefined;
  readonly disabled?: boolean | undefined;
}
