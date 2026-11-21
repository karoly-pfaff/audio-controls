export function formatClockTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0)
    throw new RangeError('Time must be finite and nonnegative.');
  const whole = Math.floor(seconds);
  const minutes = Math.floor(whole / 60);
  const remainder = String(whole % 60).padStart(2, '0');
  if (minutes < 60) return String(minutes).padStart(2, '0') + ':' + remainder;
  return (
    String(Math.floor(minutes / 60)).padStart(2, '0') +
    ':' +
    String(minutes % 60).padStart(2, '0') +
    ':' +
    remainder
  );
}
