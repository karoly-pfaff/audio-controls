import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

export const PACKAGE_ROOT = fileURLToPath(new URL('../../', import.meta.url));

export function readManifest() {
  return JSON.parse(readFileSync(new URL('../../package.json', import.meta.url), 'utf8'));
}

export function runNpm(argumentsList, directory = PACKAGE_ROOT) {
  const executable = process.env.npm_execpath;
  if (!executable) throw new Error('Run release tools through npm scripts.');
  return execFileSync(process.execPath, [executable, ...argumentsList], {
    cwd: directory,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'inherit'],
  });
}
