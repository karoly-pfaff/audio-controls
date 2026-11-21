import ts from 'typescript';
import { resolve } from 'node:path';
import { COMPONENT_DEFAULTS, CONTRACT_NAMES } from './reference-schema.mjs';
import { escapeHtml } from './html-text.mjs';

export function createApiReference(root) {
  const config = ts.readConfigFile(resolve(root, 'tsconfig.json'), ts.sys.readFile);
  if (config.error) throw new Error('Cannot read library TypeScript configuration.');
  const options = ts.parseJsonConfigFileContent(config.config, ts.sys, root).options;
  const entries = ['sources/index.ts', 'sources/timeline/index.ts'].map((path) =>
    resolve(root, path),
  );
  const program = ts.createProgram(entries, options);
  const checker = program.getTypeChecker();
  const symbols = exportedSymbols(program, checker, entries);
  return buildTables(checker, symbols);
}

function exportedSymbols(program, checker, entries) {
  return new Map(
    entries.flatMap((entry) => {
      const module = checker.getSymbolAtLocation(program.getSourceFile(entry));
      return checker
        .getExportsOfModule(module)
        .map((symbol) => [symbol.name, resolveSymbol(checker, symbol)]);
    }),
  );
}

function resolveSymbol(checker, symbol) {
  return symbol.flags & ts.SymbolFlags.Alias ? checker.getAliasedSymbol(symbol) : symbol;
}

function buildTables(checker, symbols) {
  const tables = new Map();
  for (const name of Object.keys(COMPONENT_DEFAULTS)) {
    const symbol = symbols.get(name);
    const props = componentProperties(checker, symbol);
    tables.set('API:' + name, propertyTable(checker, props, COMPONENT_DEFAULTS[name]));
  }
  addContracts(tables, { checker, symbols });
  return tables;
}

function addContracts(tables, context) {
  for (const name of CONTRACT_NAMES) {
    const type = context.checker.getDeclaredTypeOfSymbol(context.symbols.get(name));
    tables.set('CONTRACT:' + name, propertyTable(context.checker, type, {}));
  }
}

function componentProperties(checker, symbol) {
  const callable = checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration);
  const signature = callable.getCallSignatures()[0];
  const parameter = signature.parameters[0];
  return checker.getTypeOfSymbolAtLocation(parameter, parameter.valueDeclaration);
}

function propertyTable(checker, type, defaults) {
  const rows = checker
    .getPropertiesOfType(type)
    .map((property) => propertyRow(checker, property, defaults));
  return (
    '<div class="table-scroll"><table class="api-table"><thead><tr><th>Property</th><th>Type</th><th>Default</th></tr></thead><tbody>' +
    rows.join('') +
    '</tbody></table></div>'
  );
}

function propertyRow(checker, property, defaults) {
  const type = checker.getTypeOfSymbolAtLocation(
    property,
    property.valueDeclaration ?? property.declarations[0],
  );
  const label = checker.typeToString(type, undefined, ts.TypeFormatFlags.NoTruncation);
  const optional = Boolean(property.flags & ts.SymbolFlags.Optional);
  const requirement = optional
    ? '<span class="optional">optional</span>'
    : '<span class="required">required</span>';
  return (
    '<tr><td><code>' +
    escapeHtml(property.name) +
    '</code><br />' +
    requirement +
    '</td><td><code>' +
    escapeHtml(label) +
    '</code></td><td>' +
    escapeHtml(defaults[property.name] ?? '—') +
    '</td></tr>'
  );
}
