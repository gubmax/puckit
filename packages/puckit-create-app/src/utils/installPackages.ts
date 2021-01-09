import execa from 'execa'

import { printInstallingPackagesFailedMessage, printInstallPackagesMessage } from './console'

const installPackages = (projectPath: string, projectName: string): Promise<void> => {
  printInstallPackagesMessage(projectName)

  process.chdir(projectPath)

  return new Promise((resolve, reject) => {
    execa('npm', ['install'])
      .then(() => resolve())
      .catch((err) => {
        printInstallingPackagesFailedMessage()
        reject(err)
      })
  })
}

export default installPackages
