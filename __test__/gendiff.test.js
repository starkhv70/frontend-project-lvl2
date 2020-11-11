import _ from 'lodash';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const testTypes = [['json', 'stylish'],
  ['yml', 'stylish'],
  ['ini', 'stylish'],
  ['json', 'plain'],
  ['json', 'json'],
  ['ini', 'json']];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each(testTypes)('compare files with type: %s, output format: %s', (fileExt, outputFormat) => {
  const filepath1 = getFixturePath(`file1.${fileExt}`);
  const filepath2 = getFixturePath(`file2.${fileExt}`);
  const result = readFile(`expected${_.upperFirst(outputFormat)}.txt`);
  expect(gendiff(filepath1, filepath2, outputFormat)).toEqual(result);
});
