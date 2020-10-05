import _ from 'lodash';
import parse from './parsers.js';

const buildDiff = (obj1, obj2) => {
  const keys = _.union(Object.keys(obj1), Object.keys(obj2)).sort();
  const result = keys.reduce((acc, key) => {
    const key1Exists = _.has(obj1, key);
    const key2Exists = _.has(obj2, key);
    const key1IsObject = _.isObject(obj1[key]);
    const key2IsObject = _.isObject(obj2[key]);

    if (key1Exists && key2Exists) {
      if (key1IsObject && key2IsObject) {
        return [...acc, { type: 'children', name: key, value: buildDiff(obj1[key], obj2[key]) }];
      }
      if (obj1[key] === obj2[key]) {
        return [...acc, { type: 'unchanged', name: key, value: obj1[key] }];
      }
      return [...acc, { type: 'remove', name: key, value: obj1[key] }, { type: 'add', name: key, value: obj2[key] }];
    }
    if (key1Exists) {
      return [...acc, { type: 'remove', name: key, value: obj1[key] }];
    }
    return [...acc, { type: 'add', name: key, value: obj2[key] }];
  }, []);
  return result;
};

const gendiff = (filePath1, filePath2) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  return buildDiff(obj1, obj2);
};

export default gendiff;
