import formatAsStylish from './stylish.js';
import formatAsPlain from './plain.js';
import formatAsJson from './json.js';

export default (outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return formatAsStylish;
    case 'plain':
      return formatAsPlain;
    case 'json':
      return formatAsJson;
    default:
      throw new Error(`Unknown output format: '${outputFormat}'!`);
  }
};
