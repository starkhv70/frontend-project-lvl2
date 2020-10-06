import _ from 'lodash';
import parse from './parsers.js';

const formatStr = (indent, type, line) => `${' '.repeat(indent)}${type} ${line.key}: ${line.value}`;

const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  const result = keys.flatMap((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    const obj1HasChild = _.isObject(obj1[key]);
    const obj2HasChild = _.isObject(obj2[key]);

    if (keyInObj1 && keyInObj2) {
      if (obj1HasChild && obj2HasChild) {
        return { type: 'unchanged', key, children: buildDiff(obj1[key], obj2[key]) };
      }
      if (obj1[key] === obj2[key]) {
        return { type: 'unchanged', key, value: obj1[key] };
      }
      if (obj1HasChild) {
        return [{ type: 'remove', key, children: buildDiff(obj1[key], obj1[key]) }, { type: 'add', key, value: obj2[key] }];
      }
      if (obj2HasChild) {
        return [{ type: 'remove', key, value: obj1[key] }, { type: 'add', key, children: buildDiff(obj2[key], obj2[key]) }];
      }
      return [{ type: 'remove', key, value: obj1[key] }, { type: 'add', key, value: obj2[key] }];
    }
    if (keyInObj1) {
      if (obj1HasChild) {
        return { type: 'remove', key, children: buildDiff(obj1[key], obj1[key]) };
      }
      return { type: 'remove', key, value: obj1[key] };
    }
    if (obj2HasChild) {
      return { type: 'add', key, children: buildDiff(obj2[key], obj2[key]) };
    }
    return { type: 'add', key, value: obj2[key] };
  });
  return result;
};

const generateOutputStr = (diff) => {
  const numOfSpaces = 2;
  const parseDiff = (lines, indent) => lines.flatMap((line) => {
    const hasChildren = _.has(line, 'children');
    switch (line.type) {
      case 'add':
        if (hasChildren) {
          return [`${' '.repeat(indent)}+ ${line.key}: {`, ...parseDiff(line.children, indent + 4), `${' '.repeat(indent)}  }`];
        }
        return formatStr(indent, '+', line);
      case 'remove':
        if (hasChildren) {
          return [`${' '.repeat(indent)}- ${line.key}: {`, ...parseDiff(line.children, indent + 4), `${' '.repeat(indent)}  }`];
        }
        return formatStr(indent, '-', line);
      case 'unchanged':
        if (hasChildren) {
          return [`${' '.repeat(indent)}  ${line.key}: {`, ...parseDiff(line.children, indent + 4), `${' '.repeat(indent)}  }`];
        }
        return formatStr(indent, ' ', line);
      default:
        throw new Error(`Unknown type of line: '${line.type}'!`);
    }
  }, []);

  const result = parseDiff(diff, numOfSpaces);
  return `{\n${result.join('\n')}\n}`;
};

const gendiff = (filePath1, filePath2) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  const diff = buildDiff(obj1, obj2);
  // console.log(diff);
  return generateOutputStr(diff);
};

export default gendiff;
