import _ from 'lodash';

const fixIndent = 2;
const spaceForSign = 2;
const padding = fixIndent + spaceForSign;

const toString = (data, indent) => {
  if (!_.isPlainObject(data)) return data;
  const subStr = _.flatMap(data, (value, key) => `${' '.repeat(indent + padding)}  ${key}: ${toString(value, indent + padding)}`);
  return `{\n${subStr.join('\n')}\n${' '.repeat(indent + spaceForSign)}}`;
};

const render = (tree) => {
  const renderSubtree = (subtree, indent) => {
    const result = subtree.flatMap(({
      type, key, value, oldValue, children,
    }) => {
      const indentStr = ' '.repeat(indent);
      switch (type) {
        case 'nested':
          return `${indentStr}  ${key}: ${renderSubtree(children, indent + padding)}`;
        case 'unchanged':
          return `${indentStr}  ${key}: ${toString(value, indent)}`;
        case 'updated':
          return [`${indentStr}- ${key}: ${toString(oldValue, indent)}`, `${indentStr}+ ${key}: ${toString(value, indent)}`];
        case 'added':
          return `${indentStr}+ ${key}: ${toString(value, indent)}`;
        case 'removed':
          return `${indentStr}- ${key}: ${toString(value, indent)}`;
        default:
          throw new Error(`Unknown  diff line type: '${type}'!`);
      }
    });
    return `{\n${result.join('\n')}\n${' '.repeat(indent - spaceForSign)}}`;
  };

  return renderSubtree(tree, fixIndent);
};

export default render;
