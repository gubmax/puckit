import execa from 'execa'

import { printInstallPackagesMessage } from './console'

const installPackages = (projectPath: string, projectName: string): Promise<void> => {
  printInstallPackagesMessage(projectName)

  process.chdir(projectPath)

  return new Promise((resolve, reject) => {
    execa('npm', ['install'])
      .then(() => resolve())
      .catch(() => reject(new Error('npm installation failed')))
  })
}

export default installPackages
