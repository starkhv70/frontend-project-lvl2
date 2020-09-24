import fs from 'fs';
import yaml from 'js-yaml';
import path from 'path';

export default (filepath) => {
  const format = path.extname(filepath);
  const data = fs.readFileSync(filepath, 'utf-8');
  switch (format) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
      return yaml.safeLoad(data);
    default:
      throw new Error(`Unknown file extension: '${format}'!`);
  }
};
