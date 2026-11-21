const DIRECTIONS = new Map([
  ['ArrowUp', 1],
  ['ArrowRight', 1],
  ['ArrowDown', -1],
  ['ArrowLeft', -1],
]);

export function keyboardDirection(key: string): number | null {
  return DIRECTIONS.get(key) ?? null;
}
