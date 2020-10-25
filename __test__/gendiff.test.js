/* eslint-disable no-underscore-dangle */

import { test, expect } from '@jest/globals';
import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';
import { gendiff, buildDiff } from '../src/gendiff.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const files = [['file1.json', 'file2.json', 'stylish', 'result.txt'],
  ['file1.yml', 'file2.yml', 'stylish', 'result.txt'],
  ['file1.ini', 'file2.ini', 'stylish', 'result.txt'],
  ['fileNested1.json', 'fileNested2.json', 'stylish', 'resultNested.txt'],
  ['fileNestedWithArray.json', 'fileNested2.json', 'stylish', 'resultNestedWithArray.txt'],
  ['fileNested1.json', 'fileNested2.json', 'plain', 'resultPlain.txt'],
  ['fileNested1.json', 'fileNested2.json', 'json', 'resultNested.json']];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test('Diff is build correctly', () => {
  const file1 = readFile('fileNested1.json');
  const file2 = readFile('fileNested2.json');
  const obj1 = JSON.parse(file1);
  const obj2 = JSON.parse(file2);
  const diff = buildDiff(obj1, obj2);
  expect(JSON.stringify(diff, null, 2)).toMatchSnapshot();
});

test.each(files)('compare: %s, %s output format: %s', (fileName1, fileName2, outputFormat, fileWithResult) => {
  const filepath1 = getFixturePath(fileName1);
  const filepath2 = getFixturePath(fileName2);
  const result = readFile(fileWithResult);
  expect(gendiff(filepath1, filepath2, outputFormat)).toEqual(result);
});
