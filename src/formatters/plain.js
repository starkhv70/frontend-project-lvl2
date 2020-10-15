import _ from 'lodash';

const modifyLine = (line) => {
  const modifiedLine = { ...line };
  modifiedLine.value = (typeof (modifiedLine.value) === 'string') ? `'${modifiedLine.value}'` : modifiedLine.value;
  if (line.type === 'updated') {
    modifiedLine.oldValue = (typeof (modifiedLine.oldValue) === 'string') ? `'${modifiedLine.oldValue}'` : modifiedLine.oldValue;
    modifiedLine.oldValue = (_.has(line, 'oldValue')) ? modifiedLine.oldValue : '[complex value]';
    modifiedLine.value = (_.has(line, 'children') && _.has(line, 'oldValue')) ? '[complex value]' : modifiedLine.value;
  } else {
    modifiedLine.value = (_.has(line, 'children')) ? '[complex value]' : modifiedLine.value;
  }
  return modifiedLine;
};

export default (diff) => {
  const parseDiff = (lines, path = '') => lines.reduce((acc, line) => {
    const newPath = (path.length === 0) ? line.name : `${path}.${line.name}`;
    const outputLine = modifyLine(line);

    switch (line.type) {
      case 'unchanged':
        if (_.has(line, 'children')) {
          return [...acc, parseDiff(line.children, newPath)].flat();
        }
        return acc;
      case 'updated':
        return [...acc, `Property '${newPath}' was updated. From ${outputLine.oldValue} to ${outputLine.value}`];
      case 'added':
        return [...acc, `Property '${newPath}' was added with value: ${outputLine.value}`];
      case 'removed':
        return [...acc, `Property '${newPath}' was removed`];
      default:
        throw new Error(`Unknown  diff line type: '${line.type}'!`);
    }
  }, []);

  const result = parseDiff(diff);
  return result.join('\n');
};
