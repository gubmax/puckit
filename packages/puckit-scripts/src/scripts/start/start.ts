import { fork, Serializable } from 'child_process'
import { readFileSync } from 'fs'
import { clearConsole } from '@puckit/dev-utils'

import {
  PROTOCOL, HOST, PORT, SERVER_PORT,
} from '../../config/settings'
import removeDist from '../../config/etc/removeDist'
import { appDist } from '../../config/paths'
import {
  printLink, concatUrl, printSuccessMsg, getWaitingWebpackMessage,
  getCompilingMessage,
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

function runWorker(scriptName: string) {
  return fork(
    `${__dirname}/${scriptName}`,
    [ForkMessages.CHILD_PROCESS],
    { stdio: 'inherit' },
  )
}

function printSuccess(): void {
  printSuccessMsg(MessageTags.PUCKIT)
  printLink(LinkTypes.APP, `   ${concatUrl(PROTOCOL, HOST, PORT)}`)
  printLink(LinkTypes.SERVER, concatUrl(PROTOCOL, HOST, SERVER_PORT))
}

let firstCompilingSuccess = false
let appIsCompiling = false
let serverIsCompiling = false

function messageReducer(message: Serializable): void {
  if (!firstCompilingSuccess) {
    return
  }

  const isCompile = () => appIsCompiling || serverIsCompiling
  const printSpinner = (start: boolean) => {
    if (isCompile()) {
      return
    }

    if (start) {
      clearConsole()
    }
    printCompiling[start ? 'start' : 'stop']()
  }

  if (message === ForkMessages.APP_COMPILING) {
    printSpinner(true)
    appIsCompiling = true
    return
  }

  if (message === ForkMessages.SERVER_COMPILING) {
    printSpinner(true)
    serverIsCompiling = true
    return
  }

  if (message === ForkMessages.APP_AFTER_COMPILING) {
    appIsCompiling = false
    printSpinner(false)
    return
  }

  if (message === ForkMessages.SERVER_AFTER_COMPILING) {
    serverIsCompiling = false
    printSpinner(false)
    return
  }

  if (!isCompile() && (
    message === ForkMessages.SERVER_SUCCESS
    || message === ForkMessages.APP_SUCCESS
  )) {
    printSuccess()
  }
}

removeDist()

runWorker(ScriptNames.APP).on('message', async (appMessage) => {
  messageReducer(appMessage)
  if (appMessage === ForkMessages.APP_SUCCESS && !firstCompilingSuccess) {
    await waitForWebpack()
    runWorker(ScriptNames.SERVER).on('message', (serverMessage) => {
      messageReducer(serverMessage)
      if (serverMessage === ForkMessages.SERVER_SUCCESS && !firstCompilingSuccess) {
        firstCompilingSuccess = true
        printSuccess()
      }
    })
  }
})
