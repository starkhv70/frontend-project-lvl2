import _ from 'lodash';

const indentStep = 2;
const spaceForSign = 2;
const padding = indentStep + spaceForSign;

const createIndent = (indentSize) => ' '.repeat(indentSize);

const toString = (data, indentSize) => {
  if (Array.isArray(data)) {
    const nestedLines = _.flatMap(data, (value) => `${createIndent(indentSize + padding)}  ${toString(value, indentSize + padding)}`);
    return `[\n${nestedLines.join('\n')}\n${createIndent(indentSize + indentStep)}]`;
  }
  if (_.isPlainObject(data)) {
    const nestedLines = _.flatMap(data, (value, key) => `${createIndent(indentSize + padding)}  ${key}: ${toString(value, indentSize + padding)}`);
    return `{\n${nestedLines.join('\n')}\n${createIndent(indentSize + indentStep)}}`;
  }
  return data;
};

const render = (tree) => {
  const renderSubtree = (subtree, indentSize) => {
    const result = subtree.flatMap(({
      type, key, value, oldValue, newValue, children,
    }) => {
      const indent = createIndent(indentSize);
      switch (type) {
        case 'nested':
          return `${indent}  ${key}: ${renderSubtree(children, indentSize + padding)}`;
        case 'unchanged':
          return `${indent}  ${key}: ${toString(value, indentSize)}`;
        case 'updated':
          return [`${indent}- ${key}: ${toString(oldValue, indentSize)}`, `${indent}+ ${key}: ${toString(newValue, indentSize)}`];
        case 'added':
          return `${indent}+ ${key}: ${toString(value, indentSize)}`;
        case 'removed':
          return `${indent}- ${key}: ${toString(value, indentSize)}`;
        default:
          throw new Error(`Unknown  diff line type: '${type}'!`);
      }
    });
    return `{\n${result.join('\n')}\n${createIndent(indentSize - indentStep)}}`;
  };

  return renderSubtree(tree, indentStep);
};

export default render;
