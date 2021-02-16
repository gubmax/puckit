import { resolve } from 'path'
import { writeFile } from 'fs'
import { Compilation, Compiler, WebpackPluginInstance } from 'webpack'
import HtmlWebpackPlugin from 'html-webpack-plugin'

const TEXT_TAP_NAME = 'ExportHtml'

class ExportHtmlPlugin implements WebpackPluginInstance {
  static writeAsset(
    compilation: Compilation, webpackHtmlFilename: string, callback: Function,
  ): void {
    const fullPath = resolve(
      compilation.compiler.outputPath, webpackHtmlFilename,
    )

    writeFile(
      fullPath,
      compilation.assets[webpackHtmlFilename].source(),
      (err) => callback(err || null),
    )
  }

  static exportHtml(compiler: Compiler, compilation: Compilation): void {
    const write = (
      htmlPluginData: { outputName: string }, callback: Function,
    ) => ExportHtmlPlugin.writeAsset(
      compilation, htmlPluginData.outputName, callback,
    )

    const HtmlWebpackPluginInstance = compiler.options.plugins
      .map(({ constructor }) => constructor)
      .find((constructor) => constructor?.name === 'HtmlWebpackPlugin')

    const hooks = (HtmlWebpackPluginInstance as typeof HtmlWebpackPlugin).getHooks(compilation)

    hooks.afterEmit.tapAsync(TEXT_TAP_NAME, write)
  }

  // eslint-disable-next-line class-methods-use-this
  apply(compiler: Compiler): void {
    compiler.hooks.compilation.tap(
      TEXT_TAP_NAME,
      (compilation) => ExportHtmlPlugin.exportHtml(compiler, compilation),
    )
  }
}

export default ExportHtmlPlugin
