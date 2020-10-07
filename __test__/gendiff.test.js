/* eslint-disable no-underscore-dangle */

import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import gendiff from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const files = [['file1.json', 'file2.json', 'stylish', 'result.txt'],
  ['file1.yml', 'file2.yml', 'stylish', 'result.txt'],
  ['file1.ini', 'file2.ini', 'stylish', 'result.txt'],
  ['fileNested1.json', 'fileNested2.json', 'stylish', 'resultNested.txt']];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each(files)('compare: %s, %s output format: %s', (fileName1, fileName2, outputFormat, fileWithResult) => {
  const filepath1 = getFixturePath(fileName1);
  const filepath2 = getFixturePath(fileName2);
  const result = readFile(fileWithResult);
  expect(gendiff(filepath1, filepath2, outputFormat)).toEqual(result);
});
