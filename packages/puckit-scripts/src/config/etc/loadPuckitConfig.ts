import { existsSync } from 'fs'
import { clearConsole } from '@puckit/dev-utils'

import { appPuckitConfig } from '../paths'
import { printInvalidPuckitConfig } from './messages'

type ModifyConfig = (opts: object) => void

export interface PuckitConfig {
  modifyWebpackConfig?: {
    app?: ModifyConfig,
    server?: ModifyConfig,
    devServer?: ModifyConfig,
  }
}

function loadPuckitConfig(): PuckitConfig {
  let config: PuckitConfig = {}

  if (!existsSync(appPuckitConfig)) {
    return config
  }

  try {
    config = require(appPuckitConfig)
    return config
  } catch (error) {
    clearConsole()
    printInvalidPuckitConfig()
    return process.exit(1)
  }
}

export default loadPuckitConfig
