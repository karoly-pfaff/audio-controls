import { Linter } from 'eslint';
import assert from 'node:assert/strict';
import test from 'node:test';
import tseslint from 'typescript-eslint';
import declarationSpacing from './declaration-spacing.mjs';

function formatDeclarations(source) {
  return new Linter().verifyAndFix(source, {
    languageOptions: { parser: tseslint.parser },
    plugins: { readable: { rules: { 'declaration-spacing': declarationSpacing } } },
    rules: { 'readable/declaration-spacing': 'error' },
  });
}

test('declaration spacing fixes exported and internal TypeScript contracts', () => {
  const source = 'interface First {}\nexport interface Second {}\ntype Choice = string;';
  const checked = formatDeclarations(source);
  assert.deepEqual(checked.messages, []);
  assert.equal(
    checked.output,
    'interface First {}\n\nexport interface Second {}\n\ntype Choice = string;',
  );
  assert.equal(formatDeclarations(checked.output).fixed, false);
});

test('declaration spacing keeps imports, re-exports and related short constants compact', () => {
  const source =
    "import first from 'first';\nimport second from 'second';\nexport { first };\nexport { second };\nconst lower = 0;\nconst upper = 1;\nfunction select() {}";
  assert.equal(
    formatDeclarations(source).output,
    "import first from 'first';\nimport second from 'second';\n\nexport { first };\nexport { second };\n\nconst lower = 0;\nconst upper = 1;\n\nfunction select() {}",
  );
});

test('class spacing separates methods and callback fields without splitting data fields', () => {
  const source =
    'class Session {\n  first = 1;\n  second = 2;\n  constructor() {}\n  get count() { return 2; }\n  notify = () => {};\n  close() {}\n}';
  assert.equal(
    formatDeclarations(source).output,
    'class Session {\n  first = 1;\n  second = 2;\n\n  constructor() {}\n\n  get count() { return 2; }\n\n  notify = () => {};\n\n  close() {}\n}',
  );
});

test('spacing keeps trailing comments and documentation with their original declarations', () => {
  const source = 'interface First {} // trailing\n/** Documents Second. */\ninterface Second {}';
  assert.equal(
    formatDeclarations(source).output,
    'interface First {} // trailing\n\n/** Documents Second. */\ninterface Second {}',
  );
  const correct = 'interface First {}\n\n/** Documents Second. */\ninterface Second {}';
  assert.equal(formatDeclarations(correct).fixed, false);
});

test('same-line declarations gain separators without changing string literal contents', () => {
  const source = "class First {} class Second { text = 'keep  these  spaces'; }";
  const checked = formatDeclarations(source);
  assert.equal(checked.output, "class First {} \n\nclass Second { text = 'keep  these  spaces'; }");
  assert.deepEqual(checked.messages, []);
});
