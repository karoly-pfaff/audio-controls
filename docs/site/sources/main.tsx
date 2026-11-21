import { createElement } from 'react';
import { createRoot } from 'react-dom/client';
import { SliderDemo } from './demos/slider/SliderDemo.tsx';
import { KnobDemo } from './demos/knob/KnobDemo.tsx';
import { ToggleDemo } from './demos/toggle-button/ToggleDemo.tsx';
import { TransportDemo } from './demos/transport-controls/TransportDemo.tsx';
import { TransportButtonDemo } from './demos/transport-button/TransportButtonDemo.tsx';
import { MeterDemo } from './demos/stereo-meter/MeterDemo.tsx';
import { CanvasDemo } from './demos/canvas-waveform/CanvasDemo.tsx';
import { ViewportDemo } from './demos/timeline-viewport/ViewportDemo.tsx';
import { RulerDemo } from './demos/timeline-ruler/RulerDemo.tsx';
import { WaveformDemo } from './demos/timeline-waveform/WaveformDemo.tsx';
import { RegionsDemo } from './demos/timeline-region-lane/RegionsDemo.tsx';
import { PlayheadDemo } from './demos/timeline-playhead/PlayheadDemo.tsx';
import { ZoomDemo } from './demos/timeline-zoom/ZoomDemo.tsx';
import { TimelineDemo } from './demos/composition/TimelineDemo.tsx';
import { PeaksDemo } from './demos/peak-reduction/PeaksDemo.tsx';
import { ThemeDemo } from './demos/themes/ThemeDemo.tsx';
import { initializeDocumentation } from './navigation/initializeDocumentation.ts';
import '@karoly-pfaff/audio-controls-react/styles.css';
import './styles/base.css';
import './styles/layout.css';
import './styles/content.css';
import './styles/reference.css';
import './styles/examples.css';
import './styles/timeline.css';
import './styles/themes.css';
import './styles/responsive.css';

const DEMOS = new Map([
  ['slider', SliderDemo],
  ['knob', KnobDemo],
  ['toggle-button', ToggleDemo],
  ['transport-controls', TransportDemo],
  ['transport-button', TransportButtonDemo],
  ['stereo-meter', MeterDemo],
  ['canvas-waveform', CanvasDemo],
  ['timeline-viewport', ViewportDemo],
  ['timeline-ruler', RulerDemo],
  ['timeline-waveform', WaveformDemo],
  ['timeline-region-lane', RegionsDemo],
  ['timeline-playhead', PlayheadDemo],
  ['timeline-zoom', ZoomDemo],
  ['composition', TimelineDemo],
  ['peak-reduction', PeaksDemo],
  ['themes', ThemeDemo],
]);

for (const [name, component] of DEMOS) {
  const container = document.getElementById('demo-' + name);
  if (!container) throw new Error('Missing documentation example: ' + name);
  createRoot(container).render(createElement(component));
}

initializeDocumentation();
