export const COMPONENT_DEFAULTS = {
  Slider: {
    min: '0',
    max: '1',
    step: '0.01',
    unit: 'percentage display',
    showLabel: 'true',
    disabled: 'false',
  },
  Knob: { min: '-1', max: '1', step: '0.01', unit: 'L/R', disabled: 'false' },
  ToggleButton: { variant: 'default', disabled: 'false' },
  TransportControls: {},
  TransportButton: { disabled: 'false', active: 'false' },
  StereoMeter: {},
  CanvasWaveform: {
    width: '800',
    height: '48',
    color: '#00e5ff',
    interactive: 'Boolean(peaks && onSeek)',
    accessibleLabel: 'Seek position',
  },
  TimelineViewport: {
    label: 'Timeline viewport',
    scrollClassName: 'acr-timeline-scroll',
    contentClassName: 'acr-timeline-content',
  },
  TimelineRuler: { className: 'acr-timeline-ruler' },
  TimelineWaveform: { label: 'Audio waveform', className: 'acr-timeline-waveform' },
  TimelineRegionLane: { label: 'Timeline regions', className: 'acr-timeline-regions' },
  TimelinePlayhead: { className: 'acr-timeline-playhead' },
  TimelineZoom: {},
};

export const CONTRACT_NAMES = [
  'WaveformPeaks',
  'TimelineRegion',
  'TimelineWindow',
  'TimelineView',
  'StereoLevels',
];
