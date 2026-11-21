export function accentText(hex: string): string {
  const channels = [1, 3, 5].map((start) =>
    linearChannel(Number.parseInt(hex.slice(start, start + 2), 16) / 255),
  );
  const luminance =
    (channels[0] ?? 0) * 0.2126 + (channels[1] ?? 0) * 0.7152 + (channels[2] ?? 0) * 0.0722;
  return luminance > 0.179 ? '#000000' : '#ffffff';
}

function linearChannel(channel: number): number {
  return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
}
