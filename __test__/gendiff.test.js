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
  ['fileNested1.json', 'fileNested2.json', 'plain', 'resultPlain.txt'],
  ['fileNested1.json', 'fileNested2.json', 'json', 'resultNested.json']];

const getFixturePath = (filename) => path.join(__dirname, '..', '__fixtures__', filename);
const readFile = (filename) => fs.readFileSync(getFixturePath(filename), 'utf-8');

test.each(files)('compare: %s, %s output format: %s', (fileName1, fileName2, outputFormat, fileWithResult) => {
  const filepath1 = getFixturePath(fileName1);
  const filepath2 = getFixturePath(fileName2);
  const result = readFile(fileWithResult);
  expect(gendiff(filepath1, filepath2, outputFormat)).toEqual(result);
});

test('buildiff', () => {
  const obj1 = { obj: { a: { c: 1, d: 2 }, b: 2, f: 'str' }, g: true };
  const obj2 = { obj: { a: 4, f: 'str', h: 2 }, g: false, j: { k: 'value' } };
  const result = [{
    type: 'updated', key: 'g', value: false, oldValue: true,
  },
  { type: 'added', key: 'j', value: { k: 'value' } },
  {
    type: 'nested',
    key: 'obj',
    children: [
      {
        key: 'a',
        type: 'updated',
        value: 4,
        oldValue: { c: 1, d: 2 },
      },
      {
        key: 'b',
        type: 'removed',
        value: 2,
      },
      {
        key: 'f',
        type: 'unchanged',
        value: 'str',
      },
      {
        key: 'h',
        type: 'added',
        value: 2,
      }],
  }];

  expect(buildDiff(obj1, obj2)).toEqual(result);
});
