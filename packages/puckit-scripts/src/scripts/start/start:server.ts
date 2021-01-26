import webpack, { Stats } from 'webpack'
import { clearConsole } from '@puckit/dev-utils'

import { PROTOCOL, HOST, SERVER_PORT } from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.server.config'
import createCompiler from '../../config/etc/createCompiler'
import {
  printLink, printSuccessMsg, MessageTags, printCompiling,
  printDevServer, printDoneCompilingWithWarnings, printFailedToCompile, printPortWasOccupied,
} from '../../config/etc/messages'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const isChildProcess = !!process.argv[2]

const onOccupied = (port: number): void => {
  clearConsole()
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

  const callback = (err?: Error, stats?: Stats) => {
    if (err || stats?.hasErrors()) {
      clearConsole()
      printFailedToCompile(MessageTags.SERVER)
      const compilationErr = stats?.compilation.errors[0] || { message: undefined }
      console.log(err || compilationErr.message || compilationErr)
      return
    }

    if (isChildProcess && process.send) {
      process.send(currPort)
      return
    }

    printSuccessMsg(MessageTags.SERVER)
    printLink(MessageTags.SERVER, 'Server', PROTOCOL, HOST, currPort)
  }

  createCompiler({
    webpack,
    config: webpackConfig,
    callback,
    onCompiling: () => printCompiling(MessageTags.SERVER),
    onDoneCompilingWithWarnings: () => printDoneCompilingWithWarnings(MessageTags.SERVER),
    onFailedToCompile: () => printFailedToCompile(MessageTags.SERVER),
  })
})
