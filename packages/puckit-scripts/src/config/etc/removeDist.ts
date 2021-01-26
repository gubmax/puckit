import { existsSync, readdirSync, unlinkSync } from 'fs'
import path from 'path'

import { printRemoveFiles } from './messages'

const removeDist = () => {
  const directoryPath = './dist'

  if (existsSync(directoryPath)) {
    printRemoveFiles(directoryPath)

    readdirSync(directoryPath)
      .forEach((file) => {
        unlinkSync(path.join(directoryPath, file))
      })
  }
}

export default removeDist
