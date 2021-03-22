import { Configuration } from 'webpack-dev-server'

import { appPublic } from '../paths'

const devServerConfigFactory = (
  protocol: string, host: string, port: number, publicPath: string,
): Configuration => ({
  compress: true,
  clientLogLevel: 'none',
  contentBase: appPublic,
  watchContentBase: true,
  watchOptions: {
    ignored: /node_modules/,
  },
  hot: true,
  publicPath: publicPath || '/',
  quiet: true,
  https: protocol === 'https',
  host,
  port,
  overlay: false,
  historyApiFallback: true,
})

export default devServerConfigFactory
