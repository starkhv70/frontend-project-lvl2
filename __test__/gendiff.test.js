import { test, expect } from '@jest/globals';
import parser from '../src/gendiff.js';

test('parser', () => {
  const json1 = {
    host: 'hexlet.io',
    timeout: 50,
    proxy: '123.234.53.22',
    follow: false,
  };
  const json2 = {
    timeout: 20,
    verbose: true,
    host: 'hexlet.io',
  };
  const result = `{
    - follow: false
      host: hexlet.io
    - proxy: 123.234.53.22
    - timeout: 50
    + timeout: 20
    + verbose: true
  }`;

  expect(parser(json1, json2)).toEqual(result);
  expect(parser({}, {})).toEqual({});
});
