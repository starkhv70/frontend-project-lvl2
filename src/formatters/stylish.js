import _ from 'lodash';

const defaultIndentsCount = 2;
const spaceForSign = 2;
const padding = defaultIndentsCount + spaceForSign;

const createIndent = (indentsCount) => ' '.repeat(indentsCount);

const toString = (data, indentsCount) => {
  if (!_.isPlainObject(data)) return data;
  const subStr = _.flatMap(data, (value, key) => `${createIndent(indentsCount + padding)}  ${key}: ${toString(value, indentsCount + padding)}`);
  return `{\n${subStr.join('\n')}\n${createIndent(indentsCount + spaceForSign)}}`;
};

const render = (tree) => {
  const renderSubtree = (subtree, indentsCount) => {
    const result = subtree.flatMap(({
      type, key, value, oldValue, children,
    }) => {
      const indent = createIndent(indentsCount);
      switch (type) {
        case 'nested':
          return `${indent}  ${key}: ${renderSubtree(children, indentsCount + padding)}`;
        case 'unchanged':
          return `${indent}  ${key}: ${toString(value, indentsCount)}`;
        case 'updated':
          return [`${indent}- ${key}: ${toString(oldValue, indentsCount)}`, `${indent}+ ${key}: ${toString(value, indentsCount)}`];
        case 'added':
          return `${indent}+ ${key}: ${toString(value, indentsCount)}`;
        case 'removed':
          return `${indent}- ${key}: ${toString(value, indentsCount)}`;
        default:
          throw new Error(`Unknown  diff line type: '${type}'!`);
      }
    });
    return `{\n${result.join('\n')}\n${' '.repeat(indentsCount - spaceForSign)}}`;
  };

  return renderSubtree(tree, defaultIndentsCount);
};

export default render;
