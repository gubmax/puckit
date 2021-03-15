import { HotModuleReplacementPlugin, DefinePlugin, Configuration } from 'webpack'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin'
import { ExportHtmlWebpackPlugin } from '@puckit/dev-utils'

import {
  appSrc, appDist, moduleFileExtensions, appHtml,
} from '../paths'
import styleLoaderConfig from './shared/styleLoaderConfig'
import babelOptions from './shared/babelOptions'
import tsLoader from './shared/tsLoader'

const REACT_REFRESH_BABEL = require.resolve('react-refresh/babel')

function configFactory(port: number): Configuration {
  return {
    name: 'app',
    target: 'web',
    mode: 'development',
    devtool: 'cheap-module-source-map',
    entry: appSrc,
    output: {
      pathinfo: true,
      path: appDist,
      filename: '[name].js',
      chunkFilename: '[name].[contenthash:8].chunk.js',
      publicPath: `http://localhost:${port}/`,
      globalObject: 'this',
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
        name: false,
      },
      runtimeChunk: {
        name: (entrypoint: { name: string }) => `runtime-${entrypoint.name}`,
      },
    },
    resolve: {
      extensions: moduleFileExtensions,
      modules: ['node_modules'],
      alias: { src: appSrc },
    },
    module: {
      parser: { javascript: { strictExportPresence: true } },
      rules: [
        { parser: { requireEnsure: false } },
        {
          oneOf: [
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
              use: [
                {
                  loader: 'babel-loader',
                  options: {
                    ...babelOptions,
                    plugins: [REACT_REFRESH_BABEL],
                  },
                },
                tsLoader,
              ],
            },
            {
              test: /\.(m?jsx?)$/,
              exclude: /node_modules/,
              loader: 'babel-loader',
              options: {
                ...babelOptions,
                plugins: [REACT_REFRESH_BABEL],
              },
            },
            styleLoaderConfig,
          ],
        },
      ],
    },
    plugins: [
      new HotModuleReplacementPlugin(),
      new ReactRefreshWebpackPlugin({ overlay: false }),
      new DefinePlugin({
        'process.env': JSON.stringify(process.env),
      }),
      new ESLintWebpackPlugin({
        extensions: moduleFileExtensions,
        context: appSrc,
      }),
      new HtmlWebpackPlugin({
        inject: true,
        template: appHtml,
      }),
      new ExportHtmlWebpackPlugin(),
    ],
  }
}

export default configFactory
