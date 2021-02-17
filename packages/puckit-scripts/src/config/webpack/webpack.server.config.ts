import { HotModuleReplacementPlugin, DefinePlugin, Configuration } from 'webpack'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
// @ts-ignore
import nodeExternals from 'webpack-node-externals'
import { StartServerWebpackPlugin } from '@puckit/dev-utils'

import {
  appServer, appDist, appPublic, moduleFileExtensions,
  appPath,
  appSrc,
} from '../paths'
import tsLoader from './shared/tsLoader'

const PRETTY_NODE_ERRORS = '@puckit/dev-utils/lib/prettyNodeErrors'
const WEBPACK_HOT = 'webpack/hot/poll?1000'

function configFactory(inspectPort: number): Configuration {
  return {
    name: 'server',
    target: 'node',
    mode: 'development',
    watch: true,
    devtool: 'cheap-module-source-map',
    entry: [
      PRETTY_NODE_ERRORS,
      WEBPACK_HOT,
      appServer,
    ],
    output: {
      path: appDist,
      filename: 'server.js',
      publicPath: appPublic,
    },
    externals: [
      nodeExternals({ allowlist: [PRETTY_NODE_ERRORS, WEBPACK_HOT] }),
    ],
    resolve: {
      extensions: moduleFileExtensions,
      modules: ['node_modules'],
      alias: {
        src: appSrc,
        server: appServer,
        // This is required so symlinks work during development.
        [PRETTY_NODE_ERRORS]: require.resolve(PRETTY_NODE_ERRORS),
      },
    },
    watchOptions: {
      ignored: '**/node_modules',
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
          ...tsLoader,
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
      new HotModuleReplacementPlugin(),
      new StartServerWebpackPlugin('server.js', inspectPort),
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
