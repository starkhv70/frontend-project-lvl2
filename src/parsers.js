import _ from 'lodash';
import yaml from 'js-yaml';
import ini from 'ini';

const toNumber = (value) => {
  if (!_.isString(value)) {
    return value;
  }
  const convertedValue = Number(value);
  return (Number.isNaN(convertedValue)) ? value : convertedValue;
};
const parseIni = (data) => {
  const tree = ini.parse(data);
  const parseSubTree = (subTree) => _.reduce(subTree, (acc, value, key) => {
    if (_.isPlainObject(value)) {
      acc[key] = parseSubTree(value);
      return acc;
    }
    acc[key] = toNumber(value);
    return acc;
  }, {});
  return parseSubTree(tree);
};

export default (data, dataType) => {
  switch (dataType) {
    case 'json':
      return JSON.parse(data);
    case 'yml':
      return yaml.safeLoad(data);
    case 'ini':
      return parseIni(data);
    default:
      throw new Error(`Unknown type of data: '${dataType}'!`);
  }
};
