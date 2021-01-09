import { existsSync } from 'fs'
import { resolve } from 'path'

import copyDir from './utils/copyDir'
import installPackages from './utils/installPackages'
import {
  printFolderAlreadyExistsMessage, printInstalledMessage, printMissingProjectNameMessage,
} from './utils/console'

const createModernApp = (projectName: string) => {
  if (!projectName) {
    printMissingProjectNameMessage()
    process.exit(1)
  }

  if (existsSync(projectName)) {
    printFolderAlreadyExistsMessage()
    process.exit(1)
  }

  const projectPath = `${process.cwd()}/${projectName}`
  const templatePath = resolve(__dirname, '../node_modules/@waxy/template/template')

  copyDir(templatePath, projectPath, projectName)
    .then(() => installPackages(projectPath, projectName))
    .then(() => printInstalledMessage(projectName, projectPath))
    .catch((err: Error) => {
      throw err
    })
}

export default createModernApp
