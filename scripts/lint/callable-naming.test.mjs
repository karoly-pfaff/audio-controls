import { ESLint, Linter } from 'eslint';
import assert from 'node:assert/strict';
import test from 'node:test';
import tseslint from 'typescript-eslint';
import callableNaming from './callable-naming.mjs';

function lintNames(source) {
  return new Linter().verify(source, {
    languageOptions: { parser: tseslint.parser },
    plugins: { readable: { rules: { 'callable-naming': callableNaming } } },
    rules: { 'readable/callable-naming': 'error' },
  });
}

test('ambiguous factories fail as declarations, expressions, arrows and typed callbacks', () => {
  const snippets = [
    'function error() { return {}; }',
    'const factory = function error() { return {}; };',
    'const error = () => ({});',
    'const error = function () { return {}; };',
    'let error: () => object;',
    'declare function error(): object;',
  ];
  for (const source of snippets) {
    const diagnostics = lintNames(source);
    assert.equal(diagnostics.length, 1, source);
    assert.equal(diagnostics[0].messageId, 'ambiguous', source);
    assert.equal(diagnostics[0].severity, 2, source);
  }
});

test('method, callback field and interface syntax cannot hide ambiguous names', () => {
  const snippets = [
    'class Factory { error() {} }',
    'class Factory { #error() {} }',
    'abstract class Factory { abstract error(): object; }',
    'class Factory { error = () => ({}); }',
    'const factory = { error() {} };',
    'const factory = { "error": () => ({}) };',
    'const factory = { ["error"]: () => ({}) };',
    'interface Factory { error(): object; }',
    'interface Factory { error: () => object; }',
  ];
  for (const source of snippets) {
    assert.equal(lintNames(source)[0]?.messageId, 'ambiguous', source);
  }
});

test('generic actions and disguised factories are rejected beyond the original error name', () => {
  for (const name of [
    'run',
    'execute',
    'handle',
    'process',
    'value',
    'available',
    'cleanup',
    'sdkError',
    'success',
    'failure',
    'report',
  ]) {
    assert.equal(lintNames(`function ${name}() {}`)[0]?.messageId, 'ambiguous', name);
  }
});

test('explicit boolean returns and type guards must read as predicates', () => {
  const snippets = [
    'function validGain(): boolean { return true; }',
    'const validGain = (): boolean => true;',
    'class Limits { validGain(): boolean { return true; } }',
    'interface Limits { validGain(): boolean; }',
    'function gain(input: unknown): input is number { return true; }',
  ];
  for (const source of snippets) {
    assert.equal(lintNames(source)[0]?.messageId, 'predicate', source);
  }
});

test('precise actions, predicates, result fields and platform getters remain valid', () => {
  assert.deepEqual(
    lintNames(`
    function createPreferenceError() { return { error: 'invalid', value: 1 }; }
    function isUnitGain(input: number): boolean { return input >= 0 && input <= 1; }
    function hasRoom(): boolean { return true; }
    function tryReserveCapacity(): boolean { return true; }
    function assertObject(input: unknown): asserts input is object {}
    const createResult = () => ({ ok: false, error: createPreferenceError() });
    const parameter = { get value() { return 1; }, set value(next) {} };
    interface Resource { dispose(): void; }
    class Resource { dispose() {} }
  `),
    [],
  );
});

test('naming findings require a semantic choice instead of an invented automatic rename', () => {
  const diagnostics = lintNames('function error() { return {}; }');
  assert.equal(diagnostics[0].fix, undefined);
  assert.equal(diagnostics[0].suggestions, undefined);
});

test('repository ESLint config fails the original error factory regression', async () => {
  // lintText must parse the supplied snippet, including under CI's single-run inference.
  const eslint = new ESLint({
    overrideConfig: {
      languageOptions: { parserOptions: { disallowAutomaticSingleRunInference: true } },
    },
  });

  const [linted] = await eslint.lintText('export function error(): number { return 1; }\n', {
    filePath: 'sources/index.ts',
  });
  assert.ok(linted.errorCount > 0);
  assert.ok(linted.messages.some((message) => message.ruleId === 'readable/callable-naming'));
});
