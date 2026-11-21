const RADIUS = 11;
const MIN_ANGLE = -135;
const MAX_ANGLE = 135;

function polar(angle: number): readonly [number, number] {
  const radians = ((angle - 90) * Math.PI) / 180;
  return [16 + RADIUS * Math.cos(radians), 16 + RADIUS * Math.sin(radians)];
}

function arc(start: number, end: number, sweep: number): string {
  const [x1, y1] = polar(start);
  const [x2, y2] = polar(end);
  return [
    'M',
    x1.toFixed(2),
    y1.toFixed(2),
    'A',
    RADIUS,
    RADIUS,
    0,
    start === MIN_ANGLE ? 1 : 0,
    sweep,
    x2.toFixed(2),
    y2.toFixed(2),
  ].join(' ');
}

export function knobGeometry(
  value: number,
  minimum: number,
  maximum: number,
): {
  readonly track: string;
  readonly active: string;
  readonly dot: readonly [number, number];
} {
  const angle = ((value - minimum) / (maximum - minimum)) * (MAX_ANGLE - MIN_ANGLE) + MIN_ANGLE;
  return {
    track: arc(MIN_ANGLE, MAX_ANGLE, 1),
    active: arc(0, angle, value >= 0 ? 1 : 0),
    dot: polar(angle),
  };
}

export function pointerKnobValue(
  horizontal: number,
  vertical: number,
  bounds: { min: number; max: number; step: number },
): number {
  const angle = (Math.atan2(vertical, horizontal) * 180) / Math.PI + 90;
  const wrapped = angle > 180 ? angle - 360 : angle;
  const ratio =
    (Math.max(MIN_ANGLE, Math.min(MAX_ANGLE, wrapped)) - MIN_ANGLE) / (MAX_ANGLE - MIN_ANGLE);
  return Math.max(
    bounds.min,
    Math.min(
      bounds.max,
      Math.round((bounds.min + ratio * (bounds.max - bounds.min)) / bounds.step) * bounds.step,
    ),
  );
}
