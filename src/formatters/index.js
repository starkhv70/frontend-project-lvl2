import formatAsStylish from './stylish.js';
import formatAsPlain from './plain.js';

export default (outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return formatAsStylish;
    case 'plain':
      return formatAsPlain;
    default:
      throw new Error(`Unknown output format: '${outputFormat}'!`);
  }
};
