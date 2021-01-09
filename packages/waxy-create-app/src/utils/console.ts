import { printMessage, MessageType, boldText } from '@waxy/dev-utils'

export const printMissingProjectNameMessage = () => {
  printMessage(MessageType.WARN, 'Please specify the project directory')
}

export const printFolderAlreadyExistsMessage = () => {
  printMessage(MessageType.ERR, 'Such folder already exists. Please try a different name or delete that folder')
}

export const printCopyingMessage = (projectName: string) => {
  printMessage(MessageType.INFO, `Creating template in folder ${boldText(projectName)}...`)
}

export const printInstallPackagesMessage = (projectName: string) => {
  printMessage(MessageType.INFO, `Installing packages for ${boldText(projectName)}...`)
}

export const printInstalledMessage = (projectName: string, projectPath: string) => {
  printMessage(MessageType.DONE, `Success! Created ${boldText(projectName)} at "${projectPath}"\n`)
  printMessage(MessageType.MAIN, 'Inside that directory, you can run several commands:\n')
  printMessage(MessageType.MAIN, `  ${boldText('npm start')} ─ Start application and server in development mode`)
  printMessage(MessageType.MAIN, `  ${boldText('npm start:app')} ─ Start application in development mode`)
  printMessage(MessageType.MAIN, `  ${boldText('npm start:server')} ─ Start server in development mode`)
}
