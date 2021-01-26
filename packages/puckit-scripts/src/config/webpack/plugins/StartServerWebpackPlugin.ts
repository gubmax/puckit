import cluster from 'cluster'
import { Compilation, Compiler } from 'webpack'
import { clearConsole } from '@puckit/dev-utils'

import { printSspArgument, printSspEntryNameNotFound, printSspError } from '../../etc/messages'

class StartServerPlugin {
  bundleName: string

  inspectPort: number

  worker: any

  constructor(bundleName: string, inspectPort: number) {
    if (bundleName === null || typeof bundleName !== 'string') {
      printSspArgument()
      process.exit()
    }

    this.bundleName = bundleName
    this.inspectPort = inspectPort
    this.worker = null
    this.afterEmit = this.afterEmit.bind(this)
    this.apply = this.apply.bind(this)
    this.startServer = this.startServer.bind(this)
  }

  startServer(compilation: Compilation, callback: Function) {
    const { bundleName, inspectPort } = this
    const { assetsInfo, outputOptions } = compilation
    const allAssetsNames = [...assetsInfo.keys()]
    const assetName = allAssetsNames.find((key) => key === bundleName)

    if (!assetName) {
      clearConsole()
      printSspEntryNameNotFound(allAssetsNames)
      process.exit()
    }

    const clusterOptions = {
      exec: `${outputOptions.path}/${bundleName}`,
      inspectPort,
    }

    cluster.setupMaster(clusterOptions)

    cluster.on('online', (worker) => {
      this.worker = worker
    })

    cluster.on('error', (err) => {
      printSspError()
      console.error(err)
    })

    cluster.fork()
    callback()
  }

  afterEmit(compilation: Compilation, callback: Function) {
    const { worker, startServer } = this

    if (worker && worker.isConnected()) {
      process.kill(worker.process.pid)
    }

    startServer(compilation, callback)
  }

  apply(compiler: Compiler) {
    const { afterEmit } = this
    const { hooks } = compiler
    hooks.afterEmit.tapAsync('StartServerPlugin', afterEmit)
  }
}

export default StartServerPlugin
