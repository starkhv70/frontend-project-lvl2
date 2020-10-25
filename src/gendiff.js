import _ from 'lodash';
import fs from 'fs';
import path from 'path';
import parse from './parsers.js';
import getFormatter from './formatters/index.js';

export const isObject = (value) => (_.isPlainObject(value) && !(value === null));

export const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();

  return keys.map((key) => {
    const keyInObj1 = _.has(obj1, key);
    const keyInObj2 = _.has(obj2, key);
    if (keyInObj1 && !keyInObj2) return { type: 'removed', key, value: obj1[key] };
    if (!keyInObj1 && keyInObj2) return { type: 'added', key, value: obj2[key] };

    if (isObject(obj1[key]) && isObject(obj2[key])) {
      return { type: 'nested', key, children: buildDiff(obj1[key], obj2[key]) };
    }

    if (!_.isEqual(obj1[key], obj2[key])) {
      return {
        type: 'updated', key, oldValue: obj1[key], value: obj2[key],
      };
    }

    return { type: 'unchanged', key, value: obj1[key] };
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
