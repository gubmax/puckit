import webpack, { Stats } from 'webpack'
import { printMessage, MessageType, clearConsole } from '@waxy/dev-utils'

import { PROTOCOL, HOST, SERVER_PORT } from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.server.config'
import createCompiler from '../../config/etc/createCompiler'
import { consoleLink, consoleSuccessMsg } from '../../config/etc/console'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

printMessage(MessageType.INFO, 'Starting development server...')

const isChildProcess = !!process.argv[2]

choosePort(HOST, SERVER_PORT).then((currPort) => {
  if (currPort === null) {
    return
  }

  process.on('unhandledRejection', (err: Error) => {
    clearConsole()
    printMessage(MessageType.ERR, 'Failed to compile server.')
    throw err
  })

  const webpackConfig = configFactory(currPort)

  const callback = (err?: Error, stats?: Stats) => {
    if (err || stats?.hasErrors()) {
      clearConsole()
      printMessage(MessageType.ERR, 'Failed to compile.')
      const compilationErr = stats?.compilation.errors[0] || { message: undefined }
      console.log(err || compilationErr.message || compilationErr)
      return
    }

    if (isChildProcess && process.send) {
      process.send(currPort)
      return
    }

    consoleSuccessMsg()
    consoleLink('Server', PROTOCOL, HOST, currPort)
  }

  createCompiler({ webpack, config: webpackConfig, callback })
})
