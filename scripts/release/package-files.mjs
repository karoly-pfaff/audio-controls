import { readFileSync } from 'node:fs';
import { posix, resolve } from 'node:path';

const ROOT_FILES = ['package.json', 'README.md', 'LICENSE', 'CHANGELOG.md'];

const REQUIRED_BUILD = [
  'build/index.js',
  'build/index.d.ts',
  'build/timeline/index.js',
  'build/timeline/index.d.ts',
  'build/styles.css',
];

export function packageFileIssues(paths) {
  const unexpected = paths
    .filter((path) => !isPackageFile(path))
    .map((path) => 'Unexpected package file: ' + path);
  const missing = [...ROOT_FILES, ...REQUIRED_BUILD]
    .filter((path) => !paths.includes(path))
    .map((path) => 'Missing package file: ' + path);
  return [...unexpected, ...missing];
}

function isPackageFile(path) {
  if (ROOT_FILES.includes(path)) return true;
  return (
    /^build\/(?:[a-z0-9-]+\/)*[A-Za-z][A-Za-z0-9.-]*\.(?:js|css|d\.ts)$/.test(path) &&
    !path.includes('.test.')
  );
}

export function stylesheetImports(file, source) {
  return Array.from(source.matchAll(/@import\s+['"]([^'"]+)['"]/g), ([, target]) => {
    if (!target.startsWith('./')) throw new Error('Package CSS imports must be relative.');
    const dependency = posix.normalize(posix.join(posix.dirname(file), target));
    if (!dependency.startsWith('build/')) throw new Error('CSS import escapes the package build.');
    return dependency;
  });
}

export function inspectPackageFiles(root, files) {
  const paths = files.map((file) => file.path);
  const issues = packageFileIssues(paths);
  if (issues.length) throw new Error(issues.join('\n'));
  for (const file of paths.filter((path) => path.endsWith('.css'))) {
    inspectStylesheet(root, file, paths);
  }
}

function inspectStylesheet(root, file, paths) {
  const source = readFileSync(resolve(root, file), 'utf8');
  for (const dependency of stylesheetImports(file, source)) {
    if (!paths.includes(dependency)) throw new Error('Missing CSS dependency: ' + dependency);
  }
}
