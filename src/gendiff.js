import _ from 'lodash';

const formatStr = (statusStr, key, value) => `  ${statusStr} ${key}: ${value}`;

const parser = (firstObj, secondObj) => {
  const keys = _.union(Object.keys(firstObj), Object.keys(secondObj)).sort();
  const result = keys.reduce((acc, key) => {
    const firstKeyExists = _.has(firstObj, key);
    const secondKeyExists = _.has(secondObj, key);
    const firstValue = firstObj[key];
    const secondValue = secondObj[key];

    if (firstKeyExists && secondKeyExists) {
      if (firstValue === secondValue) {
        return [...acc, formatStr(' ', key, firstValue)];
      }
      return [...acc, formatStr('-', key, firstValue), formatStr('+', key, secondValue)];
    }
    return firstKeyExists ? [...acc, formatStr('-', key, firstValue)] : [...acc, formatStr('+', key, secondValue)];
  }, []);

  return `{\n${result.join('\n')}\n}`;
};

export default parser;
