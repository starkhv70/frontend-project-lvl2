import formatAsStylish from './stylish.js';
import formatAsPlain from './plain.js';
import formatAsJson from './json.js';

export default (diff, outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return formatAsStylish(diff);
    case 'plain':
      return formatAsPlain(diff);
    case 'json':
      return formatAsJson(diff);
    default:
      throw new Error(`Unknown output format: '${outputFormat}'!`);
  }
};
