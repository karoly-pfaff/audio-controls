import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { Slider } from '@karoly-pfaff/audio-controls-react';
import { TimelineRuler, timelineTicks } from '@karoly-pfaff/audio-controls-react/timeline';
import { strict as assert } from 'node:assert';

assert(
  renderToString(
    createElement(Slider, {
      label: 'Volume',
      value: 0.5,
      onChange() {
        return undefined;
      },
    }),
  ).includes('range'),
);
assert(renderToString(createElement(TimelineRuler, { duration: 60, zoom: 1 })).includes('01:00'));
assert.equal(timelineTicks(60, 1).length, 7);
assert.equal(typeof globalThis.AudioContext, 'undefined');
console.log('Packed React 19 consumer and Node import without browser globals passed.');
