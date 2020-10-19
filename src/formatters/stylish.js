import _ from 'lodash';

const initialIndent = 2;
const padding = 4;

const getSigh = (type) => {
  switch (type) {
    case 'nested':
      return ' ';
    case 'unchanged':
      return ' ';
    case 'added':
      return '+';
    case 'removed':
      return '-';
    default:
      throw new Error(`Unknown  diff line type: '${type}'!`);
  }
};

const formatStr = (indent, {
  type, key, value,
}) => {
  if (!_.isPlainObject(value)) {
    return `${' '.repeat(indent)}${getSigh(type)} ${key}: ${value}`;
  }
  const header = `${' '.repeat(indent)}${getSigh(type)} ${key}: {`;
  const nestedStr = _.flatMap(value, (subValue, subKey) => formatStr(indent + padding, { type: 'unchanged', key: subKey, value: subValue }));
  const bottom = `${' '.repeat(indent)}  }`;
  return [header, ...nestedStr, bottom];
};

const render = (tree) => {
  const renderSubtree = (subtree, indent) => subtree.flatMap(({
    type, key, value, oldValue, children,
  }) => {
    if (type === 'nested') {
      const header = `${' '.repeat(indent)}${getSigh(type)} ${key}: {`;
      const nestedStr = renderSubtree(children, indent + padding);
      const bottom = `${' '.repeat(indent)}  }`;
      return [header, ...nestedStr, bottom];
    }
    if (type === 'updated') return [formatStr(indent, { type: 'removed', key, value: oldValue }), formatStr(indent, { type: 'added', key, value })].flat();
    return formatStr(indent, { type, key, value });
  });

  const result = renderSubtree(tree, initialIndent);
  return `{\n${result.join('\n')}\n}`;
};

export default render;
