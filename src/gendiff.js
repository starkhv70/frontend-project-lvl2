import _ from 'lodash';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const hasChild = (obj) => _.isObject(obj) && !Array.isArray(obj);

const buildLine = (type, name, value) => {
  const parseChildren = (child) => {
    const keys = Object.keys(child).sort();
    return keys.flatMap((key) => {
      if (hasChild(child[key])) {
        return { type: 'unchange', name: key, children: parseChildren(child[key]) };
      }
      return { type: 'unchange', name: key, value: child[key] };
    });
  };

  if (hasChild(value)) {
    return { type, name, children: parseChildren(value) };
  }
  return { type, name, value };
};

const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  return keys.flatMap((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    if (keyInObj1 && keyInObj2) {
      if (hasChild(obj1[key]) && hasChild(obj2[key])) {
        return { type: 'unchange', name: key, children: buildDiff(obj1[key], obj2[key]) };
      }
      if (obj1[key] === obj2[key]) {
        return buildLine('unchange', key, obj1[key]);
      }
      const oldLine = buildLine('update', key, obj1[key]);
      const newLine = buildLine('update', key, obj2[key]);
      if (_.has(oldLine, 'value')) {
        oldLine.oldValue = oldLine.value;
      }
      return { ...oldLine, ...newLine };
    }
    return (keyInObj1) ? buildLine('remove', key, obj1[key]) : buildLine('add', key, obj2[key]);
  });
};

const gendiff = (filePath1, filePath2, formatType) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  const diff = buildDiff(obj1, obj2);
  const formatDiff = getFormatter(formatType);
  return formatDiff(diff);
};

export default gendiff;
