import fs from 'fs';
import yaml from 'js-yaml';
import ini from 'ini';
import path from 'path';

const readFile = (filePath) => {
  const fullPath = path.resolve(filePath, process.cwd());
  const data = fs.readFileSync(fullPath, 'utf-8');
  return data;
};

export default (filePath) => {
  const format = path.extname(filePath);
  const data = readFile(filePath);
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
