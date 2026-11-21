import assert from 'node:assert/strict';
import test from 'node:test';
import { controlLayoutViolations } from './control-layout.mjs';

test('public controls have their own directories while types remain owned contracts', () => {
  assert.deepEqual(
    controlLayoutViolations({
      path: 'sources/index.ts',
      text: "export { Slider } from './slider/Slider.tsx'; export type { SliderProps } from './slider/sliderProps.ts';",
    }),
    [],
  );
});

test('a common controls directory cannot be introduced through an export alias', () => {
  const violations = controlLayoutViolations({
    path: 'sources/index.ts',
    text: "export { Slider as Volume } from './controls/Slider.tsx';",
  });
  assert.equal(violations.length, 1);
  assert.match(violations[0], /slider\//);
});

test('type-only named exports and ordinary package exports are not controls', () => {
  assert.deepEqual(
    controlLayoutViolations({
      path: 'sources/index.ts',
      text: "export { type Props } from './values/Value.tsx'; export * from 'react'; export { fn } from './model.ts';",
    }),
    [],
  );
});
