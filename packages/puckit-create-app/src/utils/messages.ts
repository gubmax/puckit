import { printMessage, MessageTypes, boldText } from '@puckit/dev-utils'

const MESSAGE_TAG = 'puckit'

export function printMissingProjectNameMessage(): void {
  printMessage(MessageTypes.WARN, 'Please specify the project directory', MESSAGE_TAG)
}

export function printFolderAlreadyExistsMessage(): void {
  printMessage(MessageTypes.ERR, 'Such folder already exists. Please try a different name or delete that folder', MESSAGE_TAG)
}

export function printCopyingMessage(projectName: string): void {
  printMessage(MessageTypes.INFO, `Creating template in folder ${boldText(projectName)}...`, MESSAGE_TAG)
}

export function printCopyingFailedMessage(): void {
  printMessage(MessageTypes.ERR, 'Copy command failed, try again', MESSAGE_TAG)
}

export function printInstallPackagesMessage(projectName: string): void {
  printMessage(MessageTypes.INFO, `Installing packages for ${boldText(projectName)}...`, MESSAGE_TAG)
}

export function printInstallingPackagesFailedMessage(): void {
  printMessage(MessageTypes.ERR, 'npm installation failed', MESSAGE_TAG)
}

export function printInstalledMessage(projectName: string, projectPath: string): void {
  printMessage(MessageTypes.DONE, `Success! Created ${boldText(projectName)} at "${projectPath}"\n`, MESSAGE_TAG)
  printMessage(MessageTypes.MAIN, 'Inside that directory, you can run several commands:\n')
  printMessage(MessageTypes.MAIN, `  ${boldText('npm start')} ─ Start application and server in development mode`)
  printMessage(MessageTypes.MAIN, `  ${boldText('npm start:app')} ─ Start application in development mode`)
  printMessage(MessageTypes.MAIN, `  ${boldText('npm start:server')} ─ Start server in development mode`)
}
