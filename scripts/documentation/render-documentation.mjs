import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { CHAPTERS, EXAMPLE_SOURCES } from './example-sources.mjs';
import { escapeHtml } from './html-text.mjs';
import { createApiReference } from './api-reference.mjs';

export function renderDocumentation(root) {
  const contentRoot = resolve(root, 'docs/site/content');
  const shell = readFileSync(resolve(contentRoot, 'shell.html'), 'utf8');
  const chapters = CHAPTERS.map((path) => readFileSync(resolve(contentRoot, path), 'utf8')).join(
    '\n',
  );
  const tables = createApiReference(root);
  const api = chapters.replaceAll(/<!-- (API|CONTRACT):(\w+) -->/g, (_, kind, name) =>
    requireTable(tables, kind + ':' + name),
  );
  const examples = api.replaceAll(/<!-- EXAMPLE:([\w-]+) -->/g, (_, name) =>
    renderExample(root, name),
  );
  return shell.replace('<!-- DOCUMENTATION_CONTENT -->', examples);
}

function requireTable(tables, name) {
  const table = tables.get(name);
  if (!table) throw new Error('Missing API reference: ' + name);
  return table;
}

function renderExample(root, name) {
  const files = EXAMPLE_SOURCES[name];
  if (!files) throw new Error('Unknown documentation example: ' + name);
  const sources = files.map((file, index) => renderSource({ root, name, file, index })).join('\n');
  return (
    '<div class="example"><div class="example-label"><span class="live-dot" aria-hidden="true"></span>Live example · interactive React</div><div class="demo" id="demo-' +
    name +
    '" data-acr-theme="light"></div><details class="example-source"><summary>React source · ' +
    String(files.length) +
    ' file(s)</summary>' +
    sources +
    '</details></div>'
  );
}

function renderSource(options) {
  const file = options.file.startsWith('../') ? 'fixtures/demoAudio.ts' : 'demos/' + options.file;
  const source = readFileSync(resolve(options.root, 'docs/site/sources', file), 'utf8');
  const id = 'code-' + options.name + '-' + String(options.index);
  return (
    '<div class="code-panel"><div class="code-header"><span>' +
    escapeHtml(file) +
    '</span><button type="button" data-copy="' +
    id +
    '">Copy</button></div><pre><code id="' +
    id +
    '">' +
    escapeHtml(source) +
    '</code></pre></div>'
  );
}
