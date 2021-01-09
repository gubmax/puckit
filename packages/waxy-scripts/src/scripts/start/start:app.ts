import webpack from 'webpack'
import WebpackDevServer from 'webpack-dev-server'
import { printMessage, MessageType, clearConsole } from '@waxy/dev-utils'

import { PROTOCOL, HOST, PORT } from '../../config/settings'
import choosePort from '../../config/etc/choosePort'
import configFactory from '../../config/webpack/webpack.app.config'
import devServerConfigFactory from '../../config/webpack/webpackDevServer.config'
import createCompiler from '../../config/etc/createCompiler'
import { consoleLink, consoleSuccessMsg } from '../../config/etc/console'

process.env.BABEL_ENV = 'development'
process.env.NODE_ENV = 'development'

require('../../config/env')

printMessage(MessageType.INFO, 'Starting webpack-dev-server...')

const isChildProcess = !!process.argv[2]

choosePort(HOST, PORT).then((currPort) => {
  if (currPort == null) {
    return
  }

  process.on('unhandledRejection', (err: Error) => {
    clearConsole()
    printMessage(MessageType.ERR, 'Failed to compile webpack-dev-server.')
    throw err
  })

  const webpackConfig = configFactory(PORT)
  const compiler = createCompiler({
    webpack,
    config: webpackConfig,
    onDoneCompiling: isChildProcess ? undefined : () => {
      consoleSuccessMsg()
      consoleLink('App', PROTOCOL, HOST, PORT)
    },
  })

  const { publicPath } = webpackConfig.output || {}
  const webpackDevServerConfig = devServerConfigFactory(
    PROTOCOL, HOST, PORT, typeof publicPath === 'string' ? publicPath : '/', isChildProcess,
  )
  const devServer = new WebpackDevServer(compiler as webpack.Compiler, webpackDevServerConfig)

  devServer.listen(currPort, HOST, (err?: Error) => {
    if (err) {
      printMessage(MessageType.ERR, 'Webpack-dev-server failed to start.')
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
