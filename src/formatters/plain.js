import _ from 'lodash';

export default (diff) => {
  const parseDiff = (lines, path = '') => lines.reduce((acc, line) => {
    const lineHasChildren = _.has(line, 'children');
    const newPath = (path.length === 0) ? line.name : `${path}.${line.name}`;
    const otputLine = { ...line };
    otputLine.value = (typeof (otputLine.value) === 'string') ? `'${otputLine.value}'` : otputLine.value;
    if (line.type === 'update') {
      otputLine.oldValue = (typeof (otputLine.oldValue) === 'string') ? `'${otputLine.oldValue}'` : otputLine.oldValue;
      otputLine.oldValue = (_.has(line, 'oldValue')) ? otputLine.oldValue : '[complex value]';
      otputLine.value = (lineHasChildren && _.has(line, 'oldValue')) ? '[complex value]' : otputLine.value;
    } else {
      otputLine.value = (lineHasChildren) ? '[complex value]' : otputLine.value;
    }
    switch (line.type) {
      case 'unchange':
        if (lineHasChildren) {
          return [...acc, parseDiff(line.children, newPath)].flat();
        }
        return acc;
      case 'update':
        return [...acc, `Property '${newPath}' was updated. From ${otputLine.oldValue} to ${otputLine.value}`];
      case 'add':
        return [...acc, `Property '${newPath}' was added with value: ${otputLine.value}`];
      case 'remove':
        return [...acc, `Property '${newPath}' was removed`];
      default:
        throw new Error(`Unknown  diff line type: '${line.type}'!`);
    }
  }, []);

  const result = parseDiff(diff);
  return result.join('\n');
};
