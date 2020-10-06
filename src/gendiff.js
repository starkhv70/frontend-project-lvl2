import _ from 'lodash';
import parse from './parsers.js';

const initialIndent = 2;
const padding = 4;

const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  const result = keys.flatMap((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    const obj1HasChild = _.isObject(obj1[key]);
    const obj2HasChild = _.isObject(obj2[key]);

    if (keyInObj1 && keyInObj2) {
      if (obj1HasChild && obj2HasChild) {
        return { type: ' ', key, children: buildDiff(obj1[key], obj2[key]) };
      }
      if (obj1HasChild) {
        return [{ type: '-', key, children: buildDiff(obj1[key], obj1[key]) }, { type: '+', key, value: obj2[key] }];
      }
      if (obj2HasChild) {
        return [{ type: '-', key, value: obj1[key] }, { type: '+', key, children: buildDiff(obj2[key], obj2[key]) }];
      }
      if (obj1[key] === obj2[key]) {
        return { type: ' ', key, value: obj1[key] };
      }
      return [{ type: '-', key, value: obj1[key] }, { type: '+', key, value: obj2[key] }];
    }
    if (keyInObj1) {
      if (obj1HasChild) {
        return { type: '-', key, children: buildDiff(obj1[key], obj1[key]) };
      }
      return { type: '-', key, value: obj1[key] };
    }
    if (obj2HasChild) {
      return { type: '+', key, children: buildDiff(obj2[key], obj2[key]) };
    }
    return { type: '+', key, value: obj2[key] };
  });
  return result;
};

const generateOutputStr = (diff) => {
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

const gendiff = (filePath1, filePath2) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  const diff = buildDiff(obj1, obj2);
  return generateOutputStr(diff);
};

export default gendiff;
