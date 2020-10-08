import _ from 'lodash';

const initialIndent = 2;
const padding = 4;

const getSigh = (type) => {
  switch (type) {
    case 'unchanged':
      return ' ';
    case 'add':
      return '+';
    case 'remove':
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

export default (diff) => {
  const parseDiff = (lines, indent) => lines.flatMap((line) => (_.has(line, 'children') ? formatStrWithChildren(indent, line, parseDiff) : formatStr(indent, line)));

  const result = parseDiff(diff, initialIndent);
  return `{\n${result.join('\n')}\n}`;
};
