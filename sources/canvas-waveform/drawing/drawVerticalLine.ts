export function drawVerticalLine(
  context: CanvasRenderingContext2D,
  position: { readonly horizontal: number; readonly height: number },
): void {
  context.beginPath();
  context.moveTo(position.horizontal, 0);
  context.lineTo(position.horizontal, position.height);
  context.stroke();
}
