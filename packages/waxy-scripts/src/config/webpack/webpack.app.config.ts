import { HotModuleReplacementPlugin, DefinePlugin, Configuration } from 'webpack'
import ESLintWebpackPlugin from 'eslint-webpack-plugin'
import HtmlWebpackPlugin from 'html-webpack-plugin'

import {
  appSrc, appDist, moduleFileExtensions, appHtml,
  appPath,
} from '../paths'
import styleLoaderConfig from './shared/styleLoaderConfig'
import babelOptions from './shared/babelOptions'

const configFactory = (port: number): Configuration => ({
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
    publicPath: `http://localhost:${port}`,
    globalObject: 'this',
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      name: false,
    },
    runtimeChunk: {
      name: (entrypoint: {name: string}) => `runtime-${entrypoint.name}`,
    },
  },
  resolve: {
    extensions: moduleFileExtensions,
    modules: ['src', 'node_modules'],
  },
  module: {
    strictExportPresence: true,
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
                options: babelOptions,
              },
              'ts-loader',
            ],
          },
          {
            test: /\.(m?jsx?)$/,
            loader: 'babel-loader',
            options: babelOptions,
          },
          styleLoaderConfig,
        ],
      },
    ],
  },
  plugins: [
    new HotModuleReplacementPlugin(),
    new DefinePlugin({
      'process.env': JSON.stringify(process.env),
    }),
    new ESLintWebpackPlugin({
      extensions: moduleFileExtensions,
      eslintPath: require.resolve('eslint'),
      context: appSrc,
      files: appPath,
    }),
    new HtmlWebpackPlugin({
      inject: true,
      template: appHtml,
    }),
  ],
})

export default configFactory
