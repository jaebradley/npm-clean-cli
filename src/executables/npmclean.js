#!/usr/bin/env node

/* eslint no-console: 0 */

import program from 'commander';

import pkg from '../../package.json';

import { clean } from '../cleaner';

program
  .version(pkg.version)
  .description('Clean NPM')
  .parse(process.argv);

clean().catch(error => console.error(`🔥  Unexpected error: ${error}`));
