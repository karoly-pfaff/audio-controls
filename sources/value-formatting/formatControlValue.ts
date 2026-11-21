export function formatControlValue(value: number, unit: string): string {
  if (unit === 'dB') return value === 0 ? '-∞' : `${(20 * Math.log10(value)).toFixed(1)} dB`;
  if (unit !== 'L/R') return String(Math.round(value * 100)) + '%';
  if (value === 0) return 'C';
  const side = value < 0 ? 'L' : 'R';
  return side + String(Math.abs(Math.round(value * 100)));
}
