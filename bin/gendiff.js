#!/usr/bin/env node

import program from 'commander';
import gendiff from '../src/gendiff.js';

program
  .version('0.0.1')
  .description('Compares two configuration files and shows a difference.')
  .helpOption('-h, --help', 'output usage information')
  .arguments('<filepath1> <filepath2>')
  .option('-f, --format [type]', 'output format', 'stylish')
  .action((filepath1, filepath2, type) => {
    console.log(gendiff(filepath1, filepath2, type));
  });

program.parse(process.argv);
