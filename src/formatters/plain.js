import _ from 'lodash';

const toString = (value) => {
  if (_.isString(value)) {
    return `'${value}'`;
  }
  if (_.isObject(value)) {
    return '[complex value]';
  }
  return value;
};

const render = (tree) => {
  const renderSubTree = (subtree, path = '') => subtree.filter(({ type }) => (type !== 'unchanged'))
    .flatMap(({
      type, key, value, oldValue, newValue, children,
    }) => {
      const newPath = (path.length === 0) ? key : `${path}.${key}`;

      switch (type) {
        case 'nested':
          return renderSubTree(children, newPath);
        case 'updated':
          return `Property '${newPath}' was updated. From ${toString(oldValue)} to ${toString(newValue)}`;
        case 'added':
          return `Property '${newPath}' was added with value: ${toString(value)}`;
        case 'removed':
          return `Property '${newPath}' was removed`;
        default:
          throw new Error(`Unknown  diff line type: '${type}'!`);
      }
    });

  const result = renderSubTree(tree);
  return result.join('\n');
};

export default render;
