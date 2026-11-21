import { Linter } from 'eslint';
import assert from 'node:assert/strict';
import test from 'node:test';
import tseslint from 'typescript-eslint';
import studioFileBoundaries from './studio-file-boundaries.mjs';

function lintBoundaries(source) {
  return new Linter().verify(source, {
    languageOptions: { parser: tseslint.parser, parserOptions: { ecmaFeatures: { jsx: true } } },
    plugins: { readable: { rules: { 'studio-file-boundaries': studioFileBoundaries } } },
    rules: { 'readable/studio-file-boundaries': 'error' },
  });
}

test('a component may call a synchronization hook defined in another file', () => {
  assert.deepEqual(
    lintBoundaries('function Preview() { usePreviewMount(); return <canvas />; }'),
    [],
  );
});

test('an effect file may own one effect and no component', () => {
  assert.deepEqual(lintBoundaries('function usePreviewMount() { useEffect(() => {}, []); }'), []);
});

test('components and effects cannot coexist, including React aliases and namespace calls', () => {
  const sources = [
    'function Preview() { useEffect(() => {}, []); return <canvas />; }',
    'import {useLayoutEffect as synchronize} from "react"; const Preview = () => <canvas />; synchronize(() => {}, []);',
    'import * as React from "react"; const Preview = React.memo(() => <canvas />); React.useInsertionEffect(() => {}, []);',
  ];
  for (const source of sources) assert.equal(lintBoundaries(source)[0]?.messageId, 'mixedFile');
});

test('multiple effects and multiple components cannot hide inside custom hooks or wrappers', () => {
  const sources = [
    'function usePreview() { useEffect(() => {}, []); useLayoutEffect(() => {}, []); }',
    'function Preview() { return <canvas />; } const Toolbar = () => <button />;',
    'const Preview = memo(() => <canvas />); const Toolbar = forwardRef(() => <button />);',
    'class Preview extends React.Component { render() { return <canvas />; } } useEffect(() => {}, []);',
  ];
  for (const source of sources) assert.equal(lintBoundaries(source)[0]?.messageId, 'mixedFile');
});
