import { resolve } from 'node:path';
import { PACKAGE_ROOT, runNpm } from './run-npm.mjs';
import { readCandidate } from './candidate-report.mjs';

readCandidate();

const fixture = resolve(PACKAGE_ROOT, 'tests/integration/react19-consumer');

console.log(
  runNpm(
    [
      'install',
      '@karoly-pfaff/audio-controls-react@file:../../../artifacts/audio-controls-react.tgz',
      '--force',
      '--ignore-scripts',
      '--no-audit',
      '--no-fund',
    ],
    fixture,
  ),
);
console.log(runNpm(['run', 'check'], fixture));
