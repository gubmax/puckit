import webpack, { Stats } from 'webpack'
import { clearConsole } from '@puckit/dev-utils'

import { PROTOCOL, HOST, SERVER_PORT } from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.server.config'
import createCompiler from '../../config/etc/createCompiler'
import checkChildProcess from '../../config/helpers/checkChildProcess'
import {
  printLink, printSuccessMsg, getCompilingMessage, printDevServer,
  printCompiledWithWarnings, printFailedToCompile, printPortWasOccupied,
} from '../../config/etc/messages'
import { ForkMessages, LinkTypes, MessageTags } from '../../config/constants'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const isChildProcess = checkChildProcess()
const printCompiling = getCompilingMessage(MessageTags.SERVER)

function onOccupied(port: number): void {
  printPortWasOccupied(MessageTags.SERVER, port)
}

printDevServer()

choosePort(HOST, SERVER_PORT, onOccupied).then((currPort) => {
  if (currPort === null) {
    return
  }

  process.on('unhandledRejection', (err: Error) => {
    clearConsole()
    printFailedToCompile(MessageTags.SERVER)
    throw err
  })

  const webpackConfig = configFactory(currPort)

  const callback = (err?: Error, stats?: Stats): void => {
    if (err || stats?.hasErrors()) {
      clearConsole()
      printFailedToCompile(MessageTags.SERVER)
      const compilationErr = stats?.compilation.errors[0] || { message: undefined }
      console.log(err || compilationErr.message || compilationErr)
      return
    }

    if (isChildProcess) {
      process.send?.(ForkMessages.SERVER_SUCCESS)
      return
    }

    printSuccessMsg(MessageTags.SERVER)
    printLink(LinkTypes.SERVER, PROTOCOL, HOST, currPort)
  }

  createCompiler({
    webpack,
    config: webpackConfig,
    callback,
    onInvalid: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.COMPILING)
        return
      }
      clearConsole()
      printCompiling.start()
    },
    onAfterCompile: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.AFTER_COMPILING)
        return
      }
      printCompiling.stop()
    },
    onFailed: () => printFailedToCompile(MessageTags.SERVER),
    onWarning: () => printCompiledWithWarnings(MessageTags.SERVER),
  })
})
