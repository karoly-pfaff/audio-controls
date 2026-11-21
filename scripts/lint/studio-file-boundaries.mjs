const EFFECT_NAMES = new Set(['useEffect', 'useLayoutEffect', 'useInsertionEffect']);
const WRAPPER_NAMES = new Set(['memo', 'forwardRef']);

function isComponentName(name) {
  return typeof name === 'string' && /^[A-Z]/.test(name);
}

function isComponentInitializer(node) {
  if (!node) return false;
  if (node.type === 'ArrowFunctionExpression' || node.type === 'FunctionExpression') return true;
  if (node.type !== 'CallExpression') return false;
  return WRAPPER_NAMES.has(callName(node.callee));
}

function callName(node) {
  if (node.type === 'Identifier') return node.name;
  if (node.type === 'MemberExpression' && !node.computed) return node.property.name;
  return undefined;
}

function rememberEffectAliases(node, names) {
  if (node.source.value !== 'react') return;
  for (const specifier of node.specifiers) {
    if (specifier.type === 'ImportSpecifier' && EFFECT_NAMES.has(specifier.imported.name))
      names.add(specifier.local.name);
  }
}

export default {
  meta: {
    type: 'problem',
    schema: [],
    messages: {
      mixedFile:
        'A source file may define one component OR one effect, never both or multiple of either.',
    },
  },
  create(context) {
    const components = [];
    const effects = [];
    const effectNames = new Set(EFFECT_NAMES);
    return {
      ImportDeclaration(node) {
        rememberEffectAliases(node, effectNames);
      },
      FunctionDeclaration(node) {
        if (isComponentName(node.id?.name)) components.push(node);
      },
      ClassDeclaration(node) {
        if (node.superClass && ['Component', 'PureComponent'].includes(callName(node.superClass)))
          components.push(node);
      },
      VariableDeclarator(node) {
        if (isComponentName(node.id.name) && isComponentInitializer(node.init))
          components.push(node);
      },
      CallExpression(node) {
        if (effectNames.has(callName(node.callee))) effects.push(node);
      },
      'Program:exit'(node) {
        if (components.length + effects.length > 1)
          context.report({
            node,
            messageId: 'mixedFile',
          });
      },
    };
  },
};
