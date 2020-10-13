import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';

export default (filePath) => {
  const format = path.extname(filePath);
  const data = fs.readFileSync(filePath, 'utf-8');
  switch (format) {
    case '.json':
      return JSON.parse(data);
    case '.yml':
      return yaml.safeLoad(data);
    case '.ini':
      return ini.parse(data);
    default:
      throw new Error(`Unknown file extension: '${format}'!`);
  }
};
