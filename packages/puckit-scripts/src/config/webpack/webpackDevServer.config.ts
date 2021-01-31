import { Configuration } from 'webpack-dev-server'

import { appPublic } from '../paths'

const devServerConfigFactory = (
  protocol: string, host: string, port: number, publicPath: string, writeToDisk = false,
): Configuration => ({
  compress: true,
  writeToDisk,
  clientLogLevel: 'none',
  contentBase: appPublic,
  watchContentBase: true,
  hot: true,
  publicPath: publicPath || '/',
  quiet: true,
  https: protocol === 'https',
  host,
  port,
  overlay: false,
  historyApiFallback: true,
  // TODO: Replace headers on proxy
  headers: {
    'Access-Control-Allow-Origin': '*',
  },
})

export default devServerConfigFactory
