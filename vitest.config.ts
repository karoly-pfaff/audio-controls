import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'jsdom',
    pool: 'vmThreads',
    maxWorkers: 1,
    fileParallelism: false,
    setupFiles: ['tests/setup.ts'],
    restoreMocks: true,
    unstubGlobals: true,
    include: ['sources/**/*.test.{ts,tsx}', 'tests/integration/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['sources/**/*.{ts,tsx}'],
      exclude: ['sources/**/*.test.{ts,tsx}'],
      reporter: ['text', 'html', 'json-summary', 'json'],
      thresholds: { perFile: true, lines: 100, functions: 100, branches: 100, statements: 100 },
    },
  },
});
