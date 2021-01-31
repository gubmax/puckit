import {
  boldText, clearConsole, MessageTypes, printMessage,
  printMessageWithSpinner, Spinner,
} from '@puckit/dev-utils'

import { LinkTypes, MessageTags } from '../constants'
import { appPath } from '../paths'

export function printPortWasOccupied(tag: MessageTags, defaultPort: string | number): void {
  printMessage(MessageTypes.ERR, `Port ${defaultPort} was occupied`, tag)
}

export function printWds(): void {
  printMessage(MessageTypes.INFO, 'Starting webpack-dev-server', MessageTags.APP)
}

export function printDevServer(): void {
  printMessage(MessageTypes.INFO, 'Starting development server', MessageTags.SERVER)
}

export function printFailedToCompile(tag: MessageTags): void {
  printMessage(MessageTypes.ERR, 'Failed to compile', tag)
}

export function getCompilingMessage(tag: MessageTags): Spinner {
  return printMessageWithSpinner(MessageTypes.INFO, 'Compiling...', tag)
}

export function printCompilingSuccess(tag: MessageTags): void {
  printMessage(MessageTypes.DONE, 'Compiled successfully!', tag)
}

export function printCompiledWithWarnings(tag: MessageTags): void {
  printMessage(MessageTypes.WARN, 'Compiled with warnings', tag)
}

const appName = require(`${appPath}/package.json`).name

export function printSuccessMsg(tag: MessageTags): void {
  clearConsole()
  printCompilingSuccess(tag)
  printMessage(MessageTypes.MAIN, `\nYou can now view ${boldText(appName)} in the browser\n`)
}

export function printLink(
  type: LinkTypes, protocol: string, host: string, port: string | number,
): void {
  return printMessage(MessageTypes.MAIN, `${boldText(type)}: ${protocol}://${host}:${boldText(port)}`)
}

export function getWaitingWebpackMessage(): Spinner {
  return printMessageWithSpinner(MessageTypes.INFO, 'Waiting webpack output', MessageTags.PUCKIT)
}

export function printRemoveFiles(directoryPath: string): void {
  printMessage(MessageTypes.INFO, `Removing files from directory "${directoryPath}"`, MessageTags.PUCKIT)
}

export function printSspArgument(): void {
  printMessage(MessageTypes.ERR, 'Argument must be a string', MessageTags.START_SERVER_PLUGIN)
}

export function printSspEntryNameNotFound(allAssetsNames: string[]): void {
  printMessage(MessageTypes.ERR, `Entry name not found. Try one of: ${allAssetsNames.join(' ')}`, MessageTags.START_SERVER_PLUGIN)
}

export function printSspError(): void {
  printMessage(MessageTypes.ERR, 'Error', MessageTags.START_SERVER_PLUGIN)
}
