import { fork } from 'child_process'
import { readFileSync } from 'fs'

import {
  PROTOCOL, HOST, PORT, SERVER_PORT,
} from '../../config/settings'
import removeDist from '../../config/etc/removeDist'
import { appDist } from '../../config/paths'
import {
  printLink, printSuccessMsg, MessageTags, printWaitingWebpack,
  printCouldNotFindWebpack,
  printWdsStarted,
} from '../../config/etc/messages'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

enum ScriptNames {
  APP = 'start:app',
  SERVER = 'start:server',
}

const waitForWebpack = async () => {
  printWaitingWebpack()
  for (;;) {
    try {
      readFileSync(`${appDist}/index.html`)
      return
    } catch (err) {
      printCouldNotFindWebpack()
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
  printWdsStarted()
  await waitForWebpack()
  spawnWorker(ScriptNames.SERVER).on('message', () => {
    printSuccessMsg(MessageTags.PUCKIT)
    printLink(MessageTags.APP, 'App', PROTOCOL, HOST, PORT)
    printLink(MessageTags.SERVER, 'Server', PROTOCOL, HOST, SERVER_PORT)
  })
})
