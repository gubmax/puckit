import { fork, ChildProcess } from 'child_process'
import { Compilation, Compiler, WebpackPluginInstance } from 'webpack'

import { printSspArgument, printSspEntryNameNotFound, printSspError } from './messages'
import { clearConsole } from './console'

class StartServerPlugin implements WebpackPluginInstance {
  bundleName: string

  entryScript?: string

  inspectPort: number

  worker: ChildProcess | null

  constructor(bundleName: string, inspectPort: number) {
    if (bundleName === null || typeof bundleName !== 'string') {
      printSspArgument()
      process.exit()
    }

    this.bundleName = bundleName
    this.inspectPort = inspectPort
    this.worker = null
    this.checkAssetName = this.checkAssetName.bind(this)
    this.handleWebpackExit = this.handleWebpackExit.bind(this)
    this.runWorker = this.runWorker.bind(this)
    this.afterEmit = this.afterEmit.bind(this)
    this.apply = this.apply.bind(this)
  }

  checkAssetName(compilation: Compilation): void {
    const { bundleName } = this
    const { assetsInfo, outputOptions } = compilation
    const allAssetsNames = [...assetsInfo.keys()]
    const assetName = allAssetsNames.find((key) => key === bundleName)

    if (!assetName) {
      clearConsole()
      printSspEntryNameNotFound(allAssetsNames)
      process.exit()
    }

    this.entryScript = `${outputOptions.path}/${this.bundleName}`
  }

  handleWebpackExit(signal: string) {
    if (this.worker) {
      process.kill(this.worker.pid, signal)
    }
  }

  runWorker(callback?: Function): void {
    if (this.worker || !this.entryScript) {
      return
    }

    const worker = fork(this.entryScript, [], {
      execArgv: process.execArgv,
      silent: true,
    })

    worker.on('exit', () => {
      process.kill(process.pid, 'SIGKILL')
    })

    worker.on('quit', () => {
      this.worker = null
    })

    worker.on('error', (err: Error) => {
      printSspError()
      console.error(err)
    })

    process.on('SIGINT', () => {
      this.handleWebpackExit('SIGINT')
    })

    process.on('SIGTERM', () => {
      this.handleWebpackExit('SIGTERM')
    })

    this.worker = worker

    if (callback) {
      callback()
    }
  }

  afterEmit(compilation: Compilation, callback: Function): void {
    this.checkAssetName(compilation)

    if (this.worker) {
      callback()
      return
    }

    this.runWorker(callback)
  }

  apply(compiler: Compiler): void {
    compiler.hooks.afterEmit.tapAsync('StartServerPlugin', this.afterEmit)
  }
}

export default StartServerPlugin
