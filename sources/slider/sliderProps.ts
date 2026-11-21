export interface SliderProps {
  readonly label: string;
  readonly value: number;
  readonly min?: number | undefined;
  readonly max?: number | undefined;
  readonly step?: number | undefined;
  readonly onChange: (value: number) => void;
  readonly unit?: string | undefined;
  readonly className?: string | undefined;
  readonly showLabel?: boolean | undefined;
  readonly accessibleLabel?: string | undefined;
  readonly disabled?: boolean | undefined;
}
