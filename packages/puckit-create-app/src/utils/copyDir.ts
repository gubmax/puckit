import { resolve as pathResolve } from 'path'
import { copy, pathExists, move } from 'fs-extra'

import { printCopyingMessage, printCopyingFailedMessage } from './console'

const copyDir = async (
  templatePath: string, projectPath: string, projectName: string,
): Promise<boolean | void> => {
  printCopyingMessage(projectName)

  try {
    await copy(templatePath, projectPath)

    return pathExists(pathResolve(projectPath, './gitignore'))
      .then((exists) => {
        if (exists) {
          return move(
            pathResolve(projectPath, './gitignore'),
            pathResolve(projectPath, './.gitignore'),
          )
        }

        return undefined
      })
  } catch (error) {
    printCopyingFailedMessage()
    throw error
  }
}

export default copyDir
