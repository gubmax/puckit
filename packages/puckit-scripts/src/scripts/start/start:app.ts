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
  printFailedToCompile, MessageTags, printCompiling, printDoneCompilingWithWarnings,
} from '../../config/etc/messages'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

const isChildProcess = !!process.argv[2]

const onOccupied = (port: number): void => {
  clearConsole()
  printPortWasOccupied(MessageTags.APP, port)
}

const onDoneCompiling = () => {
  if (isChildProcess) {
    return
  }

  printSuccessMsg(MessageTags.APP)
  printLink(MessageTags.APP, 'App', PROTOCOL, HOST, PORT)
}

printWds()

choosePort(HOST, PORT, onOccupied).then((currPort) => {
  if (currPort == null) {
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
    onCompiling: () => printCompiling(MessageTags.APP),
    onDoneCompilingWithWarnings: () => printDoneCompilingWithWarnings(MessageTags.APP),
    onFailedToCompile: () => printFailedToCompile(MessageTags.APP),
    onDoneCompiling,
  })

  const { publicPath } = webpackConfig.output || {}
  const webpackDevServerConfig = devServerConfigFactory(
    PROTOCOL, HOST, PORT, typeof publicPath === 'string' ? publicPath : '/', isChildProcess,
  )
  const devServer = new WebpackDevServer(compiler, webpackDevServerConfig)

  devServer.listen(currPort, HOST, (err?: Error) => {
    if (err) {
      printFailedToCompile(MessageTags.APP)
      console.log(err)
      return false
    }

    if (isChildProcess && process.send) {
      process.send(currPort)
    }

    return true
  })

  Array.of('SIGINT', 'SIGTERM').forEach((sig) => {
    process.on(sig, () => {
      devServer.close()
      process.exit()
    })
  })
})
