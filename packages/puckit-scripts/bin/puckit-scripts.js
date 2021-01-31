#!/usr/bin/env node
'use strict'
 
const child_process = require('child_process');
const program = require('commander');
const pkg = require('../package.json');

function runScript(scriptName) {
  const result = child_process.spawnSync(
    'node',
    [require.resolve('../lib/scripts/' + scriptName)],
    { stdio: 'inherit' }
  );

  if (!result.signal) {
    process.exit(result.status);
  }

  if (result.signal === 'SIGKILL' || result.signal === 'SIGTERM') {
    console.log('The build failed because the process exited too early.');
  }

  process.exit(result.status);
}

program.version(pkg.version, '-v, --version', 'Output the current version')

program
  .command('start')
  .description('Start application and server in development mode')
  .action(() => {
    runScript('start/start');
  });

program
  .command('start:app')
  .description('Start application in development mode')
  .action(() => {
    runScript('start/start:app');
  });

program
  .command('start:server')
  .description('Start server in development mode')
  .action(() => {
    runScript('start/start:server');
  });

program.parse(process.argv);
