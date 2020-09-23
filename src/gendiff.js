import _ from 'lodash';
import fs from 'fs';

const formatStr = (statusStr, key, value) => `  ${statusStr} ${key}: ${value}`;

const parser = (firstObj, secondObj) => {
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
  const json1 = JSON.parse(fs.readFileSync(filePath1));
  const json2 = JSON.parse(fs.readFileSync(filePath2));
  return parser(json1, json2);
};

export default gendiff;
