import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const makeNode = (type, name, parseChildren, ...values) => {
  const [value1] = values;
  const value2 = (values.length === 2) ? values[1] : value1;
  if (_.isObject(value1)) {
    return { type, name, children: parseChildren(value1, value2) };
  }
  return { type, name, value: value1 };
};

const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  return keys.flatMap((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    if (keyInObj1 && keyInObj2) {
      if (_.isObject(obj1[key]) && _.isObject(obj2[key])) {
        return makeNode('unchanged', key, buildDiff, obj1[key], obj2[key]);
      }
      if (obj1[key] === obj2[key]) {
        return makeNode('unchanged', key, buildDiff, obj1[key]);
      }
      return [makeNode('remove', key, buildDiff, obj1[key]), makeNode('add', key, buildDiff, obj2[key])];
    }
    if (keyInObj1) {
      return makeNode('remove', key, buildDiff, obj1[key]);
    }
    return makeNode('add', key, buildDiff, obj2[key]);
  });
};

const gendiff = (filePath1, filePath2, formatType) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  const diff = buildDiff(obj1, obj2);
  console.log(diff);
  const formatDiff = getFormatter(formatType);
  return formatDiff(diff);
};

export default gendiff;
