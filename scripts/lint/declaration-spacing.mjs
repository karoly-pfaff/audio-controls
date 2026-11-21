const DECLARATIONS = new Set([
  'TSInterfaceDeclaration',
  'TSTypeAliasDeclaration',
  'TSEnumDeclaration',
  'ClassDeclaration',
  'FunctionDeclaration',
  'VariableDeclaration',
]);

function unwrapDeclaration(statement) {
  return statement.declaration ?? statement;
}

function importOrExportGroup(statement) {
  if (statement.type === 'ImportDeclaration') return 'import';
  if (statement.type === 'ExportAllDeclaration') return 'export';
  if (statement.type === 'ExportNamedDeclaration' && !statement.declaration) return 'export';

  return null;
}

function areCompactVariables(previous, next) {
  return [previous, next].every(
    (statement) =>
      unwrapDeclaration(statement).type === 'VariableDeclaration' &&
      statement.loc.start.line === statement.loc.end.line,
  );
}

function shouldSeparateDeclarations(previous, next) {
  const group = importOrExportGroup(previous);
  if (group && group === importOrExportGroup(next)) return false;
  if (areCompactVariables(previous, next)) return false;

  return [previous, next].some(
    (statement) =>
      importOrExportGroup(statement) || DECLARATIONS.has(unwrapDeclaration(statement).type),
  );
}

function isDataField(member) {
  if (member.type !== 'PropertyDefinition') return false;

  return !['ArrowFunctionExpression', 'FunctionExpression'].includes(member.value?.type);
}

function shouldSeparateMembers(previous, next) {
  return !isDataField(previous) || !isDataField(next);
}

function findLeadingCommentOrDeclaration(source, previous, next) {
  return (
    source
      .getCommentsBefore(next)
      .find((comment) => comment.loc.start.line > previous.loc.end.line) ?? next
  );
}

function createBlankLineInsertion(source, previous, boundary) {
  const newline = source.text.indexOf('\n', previous.range[1]);
  if (newline !== -1 && newline < boundary.range[0]) return { offset: newline + 1, text: '\n' };

  return { offset: boundary.range[0], text: '\n\n' };
}

function requireBlankLine(context, previous, next) {
  const source = context.sourceCode;
  const boundary = findLeadingCommentOrDeclaration(source, previous, next);
  if (boundary.loc.start.line > previous.loc.end.line + 1) return;

  const edit = createBlankLineInsertion(source, previous, boundary);
  context.report({
    node: next,
    messageId: 'blankLine',
    fix: (fixer) => fixer.insertTextBeforeRange([edit.offset, edit.offset], edit.text),
  });
}

function checkSiblings(context, siblings, shouldSeparate) {
  for (let index = 1; index < siblings.length; index++) {
    const previous = siblings[index - 1];
    const next = siblings[index];
    if (shouldSeparate(previous, next)) requireBlankLine(context, previous, next);
  }
}

export default {
  meta: {
    type: 'layout',
    docs: {
      description: 'Separate declarations and class methods while keeping related fields compact.',
    },
    fixable: 'whitespace',
    schema: [],
    messages: { blankLine: 'Separate declarations or class methods with a blank line.' },
  },
  create(context) {
    return {
      Program: (node) => checkSiblings(context, node.body, shouldSeparateDeclarations),
      ClassBody: (node) => checkSiblings(context, node.body, shouldSeparateMembers),
    };
  },
};
