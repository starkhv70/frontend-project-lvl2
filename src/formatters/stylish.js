import _ from 'lodash';

const initialIndent = 2;
const padding = 4;

export default (diff) => {
  const formatStr = (indent, line) => `${' '.repeat(indent)}${line.type} ${line.key}: ${line.value}`;
  const formatStrWithChildren = (indent, line, parseChildren) => {
    const children = parseChildren(line.children, indent + padding);
    const header = `${' '.repeat(indent)}${line.type} ${line.key}: {`;
    const bottom = `${' '.repeat(indent)}  }`;
    return [header, ...children, bottom];
  };
  const parseDiff = (lines, indent) => lines.flatMap((line) => (_.has(line, 'children') ? formatStrWithChildren(indent, line, parseDiff) : formatStr(indent, line)));

  const result = parseDiff(diff, initialIndent);
  return `{\n${result.join('\n')}\n}`;
};
