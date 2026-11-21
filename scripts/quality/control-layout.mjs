import ts from 'typescript';
import { basename, dirname } from 'node:path';

function controlDirectory(name) {
  return name.replace(/[A-Z]/g, (letter, index) => (index ? '-' : '') + letter.toLowerCase());
}

function controlExports(declaration) {
  if (declaration.isTypeOnly || !declaration.exportClause) return [];
  if (!ts.isNamedExports(declaration.exportClause)) return [];

  return declaration.exportClause.elements
    .filter((element) => !element.isTypeOnly)
    .map((element) => element.propertyName?.text ?? element.name.text);
}

function declarationViolations(declaration, entryPath) {
  const target = declaration.moduleSpecifier;
  if (!target || !ts.isStringLiteral(target) || !target.text.endsWith('.tsx')) return [];

  const owner = basename(dirname(target.text));

  return controlExports(declaration)
    .filter((name) => owner !== controlDirectory(name))
    .map((name) => `${entryPath}: ${name} must live in ${controlDirectory(name)}/.`);
}

export function controlLayoutViolations(entry) {
  const source = ts.createSourceFile(entry.path, entry.text, ts.ScriptTarget.Latest, true);

  return source.statements
    .filter(ts.isExportDeclaration)
    .flatMap((declaration) => declarationViolations(declaration, entry.path));
}
