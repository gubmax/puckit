import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { clearConsole } from '@puckit/dev-utils'

import { PROTOCOL, HOST, PORT } from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.app.config'
import devServerConfigFactory from '../../config/webpack/webpackDevServer.config'
import createCompiler from '../../config/etc/createCompiler'
import {
  printLink, printSuccessMsg, printPortWasOccupied, printWds,
  printFailedToCompile, getCompilingMessage, printCompiledWithWarnings,
} from '../../config/etc/messages'
import checkChildProcess from '../../config/helpers/checkChildProcess'
import { ForkMessages, LinkTypes, MessageTags } from '../../config/constants'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const isChildProcess = checkChildProcess()
const printCompiling = getCompilingMessage(MessageTags.APP)

function onOccupied(port: number): void {
  printPortWasOccupied(MessageTags.APP, port)
}

function onDoneCompiling(): void {
  if (isChildProcess) {
    process.send?.(ForkMessages.APP_SUCCESS)
    return
  }

  printSuccessMsg(MessageTags.APP)
  printLink(LinkTypes.APP, PROTOCOL, HOST, PORT)
}

printWds()

choosePort(HOST, PORT, onOccupied).then((currPort) => {
  if (currPort === null) {
    return
  }

  process.on('unhandledRejection', (err: Error) => {
    clearConsole()
    printFailedToCompile(MessageTags.APP)
    throw err
  })

  const webpackConfig = configFactory(PORT)
  const compiler = createCompiler({
    webpack,
    config: webpackConfig,
    onInvalid: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.APP_COMPILING)
        return
      }
      clearConsole()
      printCompiling.start()
    },
    onAfterCompile: () => {
      if (isChildProcess) {
        process.send?.(ForkMessages.APP_AFTER_COMPILING)
        return
      }

      printCompiling.stop()
    },
    onFailed: () => printFailedToCompile(MessageTags.APP),
    onWarning: () => printCompiledWithWarnings(MessageTags.APP),
    onSuccess: onDoneCompiling,
  })

  const { publicPath } = webpackConfig.output || {}
  const webpackDevServerConfig = devServerConfigFactory(
    PROTOCOL, HOST, PORT, typeof publicPath === 'string' ? publicPath : '/',
  )
  const devServer = new WebpackDevServer(compiler, webpackDevServerConfig)

  devServer.listen(currPort, HOST, (err?: Error) => {
    if (err) {
      printFailedToCompile(MessageTags.APP)
      console.log(err)
    }
  })

  Array.of('SIGINT', 'SIGTERM').forEach((sig) => {
    process.on(sig, () => {
      devServer.close()
      process.exit()
    })
  })
})
