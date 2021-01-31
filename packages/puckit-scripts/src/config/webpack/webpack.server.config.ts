import { HotModuleReplacementPlugin, DefinePlugin, Configuration } from 'webpack'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
// @ts-ignore
import nodeExternals from 'webpack-node-externals'

import {
  appServer, appDist, appPublic, moduleFileExtensions,
  appPath,
} from '../paths'
import StartServerPlugin from './plugins/StartServerWebpackPlugin'

function configFactory(inspectPort: number): Configuration {
  return {
    name: 'server',
    target: 'node',
    mode: 'development',
    watch: true,
    devtool: 'cheap-module-source-map',
    entry: [
      'webpack/hot/poll?1000',
      appServer,
    ],
    output: {
      path: appDist,
      filename: 'bundle.node.js',
      publicPath: appPublic,
    },
    externals: [
      nodeExternals({ allowlist: ['webpack/hot/poll?1000'] }),
    ],
    resolve: {
      extensions: moduleFileExtensions,
      modules: ['server', 'node_modules'],
    },
    module: {
      rules: [
        {
          test: [/\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.svg$/],
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'static/media/[name].[hash:8].[ext]',
          },
        },
        {
          test: /\.(m?tsx?)$/,
          exclude: /node_modules/,
          loader: 'ts-loader',
        },
        {
          test: /(\.module)?\.(s?css|sass)$/,
          loader: 'null-loader',
        },
        {
          test: /\.html$/,
          loader: `${__dirname}/loaders/serializeHtmlTemplateLoader.js`,
        },
      ],
    },
    plugins: [
      new StartServerPlugin('bundle.node.js', inspectPort),
      new HotModuleReplacementPlugin(),
      new DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new ESLintWebpackPlugin({
        extensions: moduleFileExtensions,
        eslintPath: require.resolve('eslint'),
        context: appServer,
        files: appPath,
      }),
    ],
  }
}

export default configFactory
