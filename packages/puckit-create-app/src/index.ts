import { existsSync } from 'fs'
import { resolve } from 'path'

import copyDir from './utils/copyDir'
import installPackages from './utils/installPackages'
import {
  printFolderAlreadyExistsMessage, printInstalledMessage, printMissingProjectNameMessage,
} from './utils/console'

const createModernApp = async (projectName: string) => {
  if (!projectName) {
    printMissingProjectNameMessage()
    process.exit(1)
  }

  if (existsSync(projectName)) {
    printFolderAlreadyExistsMessage()
    process.exit(1)
  }

  const projectPath = `${process.cwd()}/${projectName}`
  const templatePath = resolve(__dirname, '../node_modules/@puckit/template/template')

  await copyDir(templatePath, projectPath, projectName)
  await installPackages(projectPath, projectName)
  printInstalledMessage(projectName, projectPath)
}

export default createModernApp
