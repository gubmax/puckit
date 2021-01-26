import execa from 'execa'

import { printInstallingPackagesFailedMessage, printInstallPackagesMessage } from './messages'

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
