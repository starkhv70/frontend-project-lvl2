import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

const buildLine = (type, name, value) => {
  const parseChildren = (child) => {
    const keys = Object.keys(child).sort();
    return keys.flatMap((key) => {
      if (_.isPlainObject(child[key])) {
        return { type: 'unchanged', name: key, children: parseChildren(child[key]) };
      }
      return { type: 'unchanged', name: key, value: child[key] };
    });
  };

  if (_.isPlainObject(value)) {
    return { type, name, children: parseChildren(value) };
  }
  return { type, name, value };
};

export const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  return keys.flatMap((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    if (keyInObj1 && keyInObj2) {
      if (_.isPlainObject(obj1[key]) && _.isPlainObject(obj2[key])) {
        return { type: 'unchanged', name: key, children: buildDiff(obj1[key], obj2[key]) };
      }
      if (obj1[key] === obj2[key]) {
        return buildLine('unchanged', key, obj1[key]);
      }
      const oldLine = buildLine('updated', key, obj1[key]);
      const newLine = buildLine('updated', key, obj2[key]);
      if (_.has(oldLine, 'value')) {
        oldLine.oldValue = oldLine.value;
      }
      return { ...oldLine, ...newLine };
    }
    return (keyInObj1) ? buildLine('removed', key, obj1[key]) : buildLine('added', key, obj2[key]);
  });
};

const ReadFile = (filePath) => {
  const fileExtension = path.extname(filePath);
  const data = fs.readFileSync(filePath, 'utf-8');
  return [data, fileExtension.slice(1)];
};

export const gendiff = (filePath1, filePath2, formatType) => {
  const [data1, fileType1] = ReadFile(filePath1);
  const [data2, fileType2] = ReadFile(filePath2);
  const obj1 = parse(data1, fileType1);
  const obj2 = parse(data2, fileType2);
  const diff = buildDiff(obj1, obj2);
  const formatDiff = getFormatter(formatType);
  return formatDiff(diff);
};

export default gendiff;
