const parser = (obj1, obj2) => {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);
  const result = keys1.reduce((acc, key) => {
    acc[`${key}:${obj1[key]}`] = '';
    return acc;
  }, {});

  return result;
};

export default parser;
