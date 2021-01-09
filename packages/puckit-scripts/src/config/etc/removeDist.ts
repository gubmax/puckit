import { existsSync, readdirSync, unlinkSync } from 'fs'
import path from 'path'
import { printMessage, MessageType } from '@puckit/dev-utils'

const removeDist = () => {
  const directoryPath = './dist'

  if (existsSync(directoryPath)) {
    printMessage(MessageType.INFO, `Removing files from directory "${directoryPath}"...`)

    readdirSync(directoryPath)
      .forEach((file) => {
        unlinkSync(path.join(directoryPath, file))
      })
  }
}

export default removeDist
