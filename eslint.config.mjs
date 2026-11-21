import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';
import sonarjs from 'eslint-plugin-sonarjs';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import declarationSpacing from './scripts/lint/declaration-spacing.mjs';
import callableNaming from './scripts/lint/callable-naming.mjs';
import studioFileBoundaries from './scripts/lint/studio-file-boundaries.mjs';

const STRUCTURAL_SIZE_RULES = ['max-lines', 'max-lines-per-function', 'max-statements'];

export default tseslint.config(
  {
    ignores: [
      '**/build/**',
      '**/node_modules/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      '.vitest/**',
      '.local/**',
      '.playwright-cli/**',
      'output/playwright/**',
      '**/.turbo/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  sonarjs.configs.recommended,
  {
    languageOptions: {
      globals: globals.node,
      // Explicit projects include colocated tests excluded from package emit configs.
      parserOptions: {
        project: [
          './tsconfig.json',
          './tests/integration/react19-consumer/tsconfig.json',
          './docs/site/tsconfig.json',
        ],
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: { reportUnusedDisableDirectives: 'error' },
    rules: {
      'max-lines': ['error', { max: 200, skipBlankLines: true, skipComments: true }],
      'max-lines-per-function': ['error', { max: 40, skipBlankLines: true, skipComments: true }],
      'max-statements': ['error', 8],
      complexity: ['error', 6],
      'sonarjs/cognitive-complexity': ['error', 8],
      'max-depth': ['error', 2],
      'max-params': ['error', 3],
      'max-nested-callbacks': ['error', 2],
      'no-nested-ternary': 'error',
      'no-else-return': ['error', { allowElseIf: false }],
      'id-length': ['error', { min: 2, exceptions: ['_'], properties: 'never' }],
      'id-denylist': [
        'error',
        'data',
        'info',
        'obj',
        'val',
        'tmp',
        'temp',
        'foo',
        'bar',
        'stuff',
        'thing',
        'handle',
        'manager',
        'util',
        'utils',
        'helper',
        'helpers',
        'doStuff',
      ],
      // Meaningful named primitive aliases document their domain concept.
      'sonarjs/redundant-type-aliases': 'off',
      eqeqeq: ['error', 'always'],
      'prefer-const': 'error',
      'no-duplicate-imports': ['error', { allowSeparateTypeImports: true }],
      'no-console': 'error',
      'no-param-reassign': ['error', { props: true }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports' }],
      '@typescript-eslint/explicit-module-boundary-types': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
    },
  },
  {
    // Repository scripts and configuration are plain JavaScript outside the TS build.
    files: ['**/*.{js,mjs}'],
    extends: [tseslint.configs.disableTypeChecked],
    rules: { '@typescript-eslint/explicit-module-boundary-types': 'off' },
  },
  {
    // Executable entry points report diagnostics to the terminal.
    files: ['scripts/**/*.mjs', 'tests/integration/react19-consumer/**/*.mjs'],
    rules: { 'no-console': 'off' },
  },
  {
    files: ['sources/**/*.{ts,tsx}', 'docs/site/sources/**/*.{ts,tsx}'],
    languageOptions: { globals: globals.browser },
    plugins: { 'react-hooks': reactHooks },
    rules: { ...reactHooks.configs.recommended.rules, 'readable/studio-file-boundaries': 'error' },
  },
  {
    // Test setup may be long; complexity, depth and correctness remain enforced.
    files: ['**/*.test.{ts,tsx,mjs}', '**/*.test-support.{ts,tsx}', '**/*.spec.{ts,tsx}'],
    rules: Object.fromEntries(STRUCTURAL_SIZE_RULES.map((rule) => [rule, 'off'])),
  },
  prettier,
  {
    plugins: {
      readable: {
        rules: {
          'declaration-spacing': declarationSpacing,
          'callable-naming': callableNaming,
          'studio-file-boundaries': studioFileBoundaries,
        },
      },
    },
    rules: { 'readable/declaration-spacing': 'error', 'readable/callable-naming': 'error' },
  },
);
