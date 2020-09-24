import _ from 'lodash';
import parse from './parsers.js';

const formatStr = (statusStr, key, value) => `  ${statusStr} ${key}: ${value}`;

const compare = (firstObj, secondObj) => {
  const keys = _.union(Object.keys(firstObj), Object.keys(secondObj)).sort();
  const result = keys.reduce((acc, key) => {
    const firstKeyExists = _.has(firstObj, key);
    const secondKeyExists = _.has(secondObj, key);

    if (firstKeyExists && secondKeyExists) {
      if (firstObj[key] === secondObj[key]) {
        return [...acc, formatStr(' ', key, firstObj[key])];
      }
      return [...acc, formatStr('-', key, firstObj[key]), formatStr('+', key, secondObj[key])];
    }
    return firstKeyExists ? [...acc, formatStr('-', key, firstObj[key])] : [...acc, formatStr('+', key, secondObj[key])];
  }, []);

  return `{\n${result.join('\n')}\n}`;
};

const gendiff = (filePath1, filePath2) => {
  const obj1 = parse(filePath1);
  const obj2 = parse(filePath2);
  return compare(obj1, obj2);
};

export default gendiff;
