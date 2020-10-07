import formatAsStylish from './stylish.js';

export default (outputFormat) => {
  switch (outputFormat) {
    case 'stylish':
      return formatAsStylish;
    default:
      throw new Error(`Unknown output format: '${outputFormat}'!`);
  }
};
