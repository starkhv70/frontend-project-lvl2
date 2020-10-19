import _ from 'lodash';

const modifyValue = (value) => {
  if (typeof (value) === 'string') {
    return `'${value}'`;
  }
  if (_.isPlainObject(value)) {
    return '[complex value]';
  }
  return value;
};

const render = (tree) => {
  const parseDiff = (subtree, path = '') => subtree.reduce((acc, {
    type, key, value, oldValue, children,
  }) => {
    const newPath = (path.length === 0) ? key : `${path}.${key}`;

    switch (type) {
      case 'nested':
        return [...acc, parseDiff(children, newPath)].flat();
      case 'updated':
        return [...acc, `Property '${newPath}' was updated. From ${modifyValue(oldValue)} to ${modifyValue(value)}`];
      case 'added':
        return [...acc, `Property '${newPath}' was added with value: ${modifyValue(value)}`];
      case 'removed':
        return [...acc, `Property '${newPath}' was removed`];
      case 'unchanged':
        return acc;
      default:
        throw new Error(`Unknown  diff line type: '${type}'!`);
    }
  }, []);

  const result = parseDiff(tree);
  return result.join('\n');
};

export default render;
