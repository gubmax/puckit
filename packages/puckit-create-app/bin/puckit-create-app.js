#!/usr/bin/env node
'use strict'
 
const program = require('commander');
const pkg = require('../package.json');
const createApp = require('../lib').default;

let projectName;

program.version(pkg.version, '-v, --version', 'output the current version')

program
  .arguments('<project-directory>')
  .action((name) => {
    projectName = name;
  });

program.parse(process.argv);

createApp(projectName);
