export interface StereoLevels {
  readonly left: number;
  readonly right: number;
}

export function smoothMeterLevel(current: number, target: number): number {
  const finite = Number.isFinite(target) ? target : 0;
  const factor = finite > current ? 0.3 : 0.88;
  return Math.max(0, Math.min(1, current * factor + finite * (1 - factor)));
}
