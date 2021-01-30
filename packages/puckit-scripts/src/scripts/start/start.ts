import { fork, Serializable } from 'child_process'
import { readFileSync } from 'fs'
import { clearConsole } from '@puckit/dev-utils'

import {
  PROTOCOL, HOST, PORT, SERVER_PORT,
} from '../../config/settings'
import removeDist from '../../config/etc/removeDist'
import { appDist } from '../../config/paths'
import {
  printLink, printSuccessMsg, getWaitingWebpackMessage, getCompilingMessage,
} from '../../config/etc/messages'
import {
  ForkMessages, LinkTypes, MessageTags, ScriptNames,
} from '../../config/constants'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const printCompiling = getCompilingMessage(MessageTags.PUCKIT)
const printWaitingWebpack = getWaitingWebpackMessage()

async function waitForWebpack() {
  printWaitingWebpack.start()
  for (;;) {
    try {
      readFileSync(`${appDist}/index.html`)
      printWaitingWebpack.stop()
      return
    } catch (err) {
      // eslint-disable-next-line no-await-in-loop
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }
}

function spawnWorker(scriptName: string) {
  return fork(
    `${__dirname}/${scriptName}`,
    [ForkMessages.CHILD_PROCESS],
    { stdio: 'inherit' },
  )
}

function printSuccess(): void {
  printSuccessMsg(MessageTags.PUCKIT)
  printLink(LinkTypes.APP, PROTOCOL, HOST, PORT)
  printLink(LinkTypes.SERVER, PROTOCOL, HOST, SERVER_PORT)
}

let firstCompilingSuccess = false
let compilingsCounter = 0

function messageReducer(message: Serializable): void {
  if (!firstCompilingSuccess) {
    return
  }

  if (message === ForkMessages.COMPILING) {
    if (!compilingsCounter) {
      clearConsole()
      printCompiling.start()
    }
    compilingsCounter += 1
    return
  }

  if (message === ForkMessages.AFTER_COMPILING) {
    if (compilingsCounter > 0) {
      compilingsCounter -= 1
    }
    if (!compilingsCounter) {
      printCompiling.stop()
    }
    return
  }

  if (
    !compilingsCounter
     && (message === ForkMessages.SERVER_SUCCESS || message === ForkMessages.APP_SUCCESS)
  ) {
    printSuccess()
  }
}

removeDist()

spawnWorker(ScriptNames.APP).on('message', async (appMessage) => {
  messageReducer(appMessage)
  if (appMessage === ForkMessages.APP_SUCCESS && !firstCompilingSuccess) {
    await waitForWebpack()
    spawnWorker(ScriptNames.SERVER).on('message', (serverMessage) => {
      messageReducer(serverMessage)
      if (serverMessage === ForkMessages.SERVER_SUCCESS && !firstCompilingSuccess) {
        firstCompilingSuccess = true
        printSuccess()
      }
    })
  }
})
