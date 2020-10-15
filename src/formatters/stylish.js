import _ from 'lodash';

const initialIndent = 2;
const padding = 4;

const getSigh = (type) => {
  switch (type) {
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

const formatStr = (indent, line) => `${' '.repeat(indent)}${getSigh(line.type)} ${line.name}: ${line.value}`;

const formatStrWithChildren = (indent, line, parseChildren) => {
  const children = parseChildren(line.children, indent + padding);
  const header = `${' '.repeat(indent)}${getSigh(line.type)} ${line.name}: {`;
  const bottom = `${' '.repeat(indent)}  }`;
  return [header, ...children, bottom];
};

const expandUpdateLine = (diff) => diff.reduce((acc, line) => {
  if (line.type === 'unchanged' && _.has(line, 'children')) {
    const unchangedLine = { ...line };
    unchangedLine.children = expandUpdateLine(line.children);
    return [...acc, unchangedLine];
  }
  if (line.type === 'updated') {
    if (_.has(line, 'oldValue')) {
      const { oldValue, ...addedLine } = line;
      addedLine.type = 'added';
      const removedLine = { type: 'removed', name: line.name, value: oldValue };
      return [...acc, removedLine, addedLine];
    }
    const { children, ...addedLine } = line;
    addedLine.type = 'added';
    const removedLine = { type: 'removed', name: line.name, children };
    return [...acc, removedLine, addedLine];
  }
  return [...acc, line];
}, []);

export default (diff) => {
  const parseDiff = (lines, indent) => lines.flatMap((line) => (_.has(line, 'children') ? formatStrWithChildren(indent, line, parseDiff) : formatStr(indent, line)));

  const expandedDiff = expandUpdateLine(diff);
  const result = parseDiff(expandedDiff, initialIndent);
  return `{\n${result.join('\n')}\n}`;
};
