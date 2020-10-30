import _ from 'lodash';

const indentStep = 2;
const spaceForSign = 2;
const padding = indentStep + spaceForSign;

const createIndent = (indentSize) => ' '.repeat(indentSize);

const toString = (data, depth) => {
  if (Array.isArray(data)) {
    const nestedLines = _.flatMap(data, (value) => `${createIndent(depth + padding)}  ${toString(value, depth + padding)}`);
    return `[\n${nestedLines.join('\n')}\n${createIndent(depth + indentStep)}]`;
  }
  if (_.isPlainObject(data)) {
    const nestedLines = _.flatMap(data, (value, key) => `${createIndent(depth + padding)}  ${key}: ${toString(value, depth + padding)}`);
    return `{\n${nestedLines.join('\n')}\n${createIndent(depth + indentStep)}}`;
  }
  return data;
};

const render = (tree) => {
  const renderSubtree = (subtree, depth) => {
    const result = subtree.flatMap(({
      type, key, value, oldValue, newValue, children,
    }) => {
      const indent = createIndent(depth);
      switch (type) {
        case 'nested':
          return `${indent}  ${key}: ${renderSubtree(children, depth + padding)}`;
        case 'unchanged':
          return `${indent}  ${key}: ${toString(value, depth)}`;
        case 'updated':
          return [`${indent}- ${key}: ${toString(oldValue, depth)}`, `${indent}+ ${key}: ${toString(newValue, depth)}`];
        case 'added':
          return `${indent}+ ${key}: ${toString(value, depth)}`;
        case 'removed':
          return `${indent}- ${key}: ${toString(value, depth)}`;
        default:
          throw new Error(`Unknown  diff line type: '${type}'!`);
      }
    });
    return `{\n${result.join('\n')}\n${createIndent(depth - indentStep)}}`;
  };

  return renderSubtree(tree, indentStep);
};

export default render;
