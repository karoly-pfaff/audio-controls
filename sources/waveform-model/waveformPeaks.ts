/** Display extrema on a uniformly spaced source-time axis, independent of audio decoding. */
export interface WaveformPeaks {
  readonly samplesPerPeak?: number;
  readonly minimum: readonly number[];
  readonly maximum: readonly number[];
}
