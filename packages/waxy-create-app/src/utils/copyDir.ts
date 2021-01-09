import { resolve as pathResolve } from 'path'
import { copy, pathExists, move } from 'fs-extra'

import { printCopyingMessage } from './console'

const copyDir = (templatePath: string, projectPath: string, projectName: string): Promise<any> => {
  printCopyingMessage(projectName)

  return new Promise((resolve, reject) => {
    copy(templatePath, projectPath)
      .then(() => (
        pathExists(pathResolve(projectPath, './gitignore'))
          .then((exists) => {
            if (exists) {
              return move(
                pathResolve(projectPath, './gitignore'),
                pathResolve(projectPath, './.gitignore'),
              )
            }

            return undefined
          })
      ))
      .then(resolve)
      .catch((err: Error) => {
        console.error(err)
        console.error('Copy command failed, try again.')
        reject(err)
        process.exit(1)
      })
  })
}

export default copyDir
