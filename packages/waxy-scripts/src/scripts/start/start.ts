import { fork } from 'child_process'
import { readFileSync } from 'fs'
import { printMessage, MessageType } from '@waxy/dev-utils'

import {
  PROTOCOL, HOST, PORT, SERVER_PORT,
} from '../../config/settings'
import removeDist from '../../config/etc/removeDist'
import { consoleLink, consoleSuccessMsg } from '../../config/etc/console'
import { appDist } from '../../config/paths'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

enum ScriptNames {
  APP = 'start:app',
  SERVER = 'start:server',
}

const waitForWebpack = async () => {
  printMessage(MessageType.INFO, 'Waiting webpack output...')
  for (;;) {
    try {
      readFileSync(`${appDist}/index.html`)
      return
    } catch (err) {
      printMessage(MessageType.MAIN, 'Could not find webpack output. Will retry in a few seconds...')
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}

const spawnWorker = (scriptName: string) => fork(
  `${__dirname}/${scriptName}`,
  ['isChildProcess'],
  { stdio: 'inherit' },
)

removeDist()

spawnWorker(ScriptNames.APP).on('message', async () => {
  printMessage(MessageType.DONE, 'Webpack-dev-server started!')
  await waitForWebpack()
  spawnWorker(ScriptNames.SERVER).on('message', () => {
    consoleSuccessMsg()
    consoleLink('App', PROTOCOL, HOST, PORT)
    consoleLink('Server', PROTOCOL, HOST, SERVER_PORT)
  })
})
