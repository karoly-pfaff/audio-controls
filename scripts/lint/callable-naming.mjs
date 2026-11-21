const AMBIGUOUS_NAMES = new Set([
  'error',
  'sdkError',
  'success',
  'failure',
  'report',
  'handle',
  'process',
  'doWork',
  'doStuff',
  'perform',
  'run',
  'execute',
  'data',
  'info',
  'item',
  'obj',
  'tmp',
  'result',
  'value',
  'manager',
  'util',
  'helper',
  'check',
  'validate',
  'valid',
  'available',
  'attempt',
  'asynchronous',
  'cleanup',
  'publicApi',
  'issue',
  'object',
  'field',
  'fields',
  'rig',
  'accepted',
  'rejected',
  'freeze',
]);

const FUNCTION_NODES = new Set([
  'ArrowFunctionExpression',
  'FunctionExpression',
  'TSFunctionType',
  'TSEmptyBodyFunctionExpression',
]);

const PREDICATE_NAME =
  /^(?:(?:is|are|has|have|was|were|can|should|needs|requires|supports|matches|contains|try)[A-Z_]|has$|includes$)/;

function staticName(node) {
  if (node.type === 'Identifier' || node.type === 'PrivateIdentifier') return node.name;
  return typeof node.value === 'string' ? node.value : undefined;
}

function returnsBoolean(callable) {
  const annotation = callable.returnType?.typeAnnotation;
  return (
    annotation?.type === 'TSBooleanKeyword' ||
    (annotation?.type === 'TSTypePredicate' && !annotation.asserts)
  );
}

function checkCallable(context, nameNode, callable) {
  const name = staticName(nameNode);
  if (!name) return;
  if (AMBIGUOUS_NAMES.has(name)) {
    context.report({ node: nameNode, messageId: 'ambiguous' });
  } else if (returnsBoolean(callable) && !PREDICATE_NAME.test(name)) {
    context.report({ node: nameNode, messageId: 'predicate' });
  }
}

function checkFunction(context, node) {
  if (node.id) checkCallable(context, node.id, node);
}

function checkVariable(context, node) {
  const callable = node.init ?? node.id.typeAnnotation?.typeAnnotation;
  if (callable && FUNCTION_NODES.has(callable.type)) checkCallable(context, node.id, callable);
}

function checkMember(context, node) {
  if (node.kind === 'get' || node.kind === 'set') return;
  const callable = node.value ?? node.typeAnnotation?.typeAnnotation;
  checkCallableMember(context, node.key, callable);
}

function checkCallableMember(context, key, callable) {
  if (callable && FUNCTION_NODES.has(callable.type)) checkCallable(context, key, callable);
}

export default {
  meta: {
    type: 'suggestion',
    docs: { description: 'Reject ambiguous callable names and require explicit predicate names.' },
    schema: [],
    messages: {
      ambiguous:
        'This callable name does not explain the operation. Name its result or effect and subject.',
      predicate:
        'Use a predicate name for a boolean or tryVerbSubject for an action returning success.',
    },
  },
  create(context) {
    return {
      'FunctionDeclaration, FunctionExpression, TSDeclareFunction': (node) =>
        checkFunction(context, node),
      VariableDeclarator: (node) => checkVariable(context, node),
      'MethodDefinition, TSAbstractMethodDefinition, PropertyDefinition, Property, TSPropertySignature':
        (node) => checkMember(context, node),
      TSMethodSignature: (node) => checkCallable(context, node.key, node),
    };
  },
};
