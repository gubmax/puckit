import {
  boldText, clearConsole, MessageTypes, printMessage,
} from '@puckit/dev-utils'

import { appPath } from '../paths'

export enum MessageTags {
  PUCKIT = 'puckit',
  APP = 'puckit:app',
  SERVER = 'puckit:server',
  START_SERVER_PLUGIN = 'puckit:start-server-plugin',
}

export const printPortWasOccupied = (tag: MessageTags, defaultPort: string | number): void => {
  printMessage(MessageTypes.ERR, `Port ${defaultPort} was occupied.`)
}

export const printWds = (): void => {
  printMessage(MessageTypes.INFO, 'Starting webpack-dev-server...', MessageTags.APP)
}

export const printDevServer = (): void => {
  printMessage(MessageTypes.INFO, 'Starting development server...', MessageTags.SERVER)
}

export const printFailedToCompile = (tag: MessageTags): void => {
  printMessage(MessageTypes.ERR, 'Failed to compile.', tag)
}

export const printCompiling = (tag: MessageTags): void => {
  printMessage(MessageTypes.INFO, 'Compiling...', tag)
}

export const printDoneCompiling = (tag: MessageTags): void => {
  printMessage(MessageTypes.DONE, 'Compiled successfully!', tag)
}

export const printDoneCompilingWithWarnings = (tag: MessageTags): void => {
  printMessage(MessageTypes.WARN, 'Compiled with warnings.', tag)
}

const appName = require(`${appPath}/package.json`).name

export const printSuccessMsg = (tag: MessageTags): void => {
  clearConsole()
  printDoneCompiling(tag)
  printMessage(MessageTypes.MAIN, `\nYou can now view ${boldText(appName)} in the browser.\n`)
}

export const printLink = (
  tag: MessageTags, name: string, protocol: string, host: string, port: string | number,
): void => (
  printMessage(MessageTypes.MAIN, `${boldText(name)}: ${protocol}://${host}:${boldText(port)}`, tag)
)

export const printWdsStarted = (): void => {
  printMessage(MessageTypes.DONE, 'Webpack-dev-server started!', MessageTags.APP)
}

export const printWaitingWebpack = (): void => {
  printMessage(MessageTypes.INFO, 'Waiting webpack output...', MessageTags.PUCKIT)
}

export const printCouldNotFindWebpack = (): void => {
  printMessage(MessageTypes.MAIN, 'Could not find webpack output. Will retry in a few seconds...')
}

export const printRemoveFiles = (directoryPath: string): void => {
  printMessage(MessageTypes.INFO, `Removing files from directory "${directoryPath}"...`, MessageTags.PUCKIT)
}

export const printSspArgument = (): void => {
  printMessage(MessageTypes.ERR, 'Argument must be a string', MessageTags.START_SERVER_PLUGIN)
}

export const printSspEntryNameNotFound = (allAssetsNames: string[]): void => {
  printMessage(MessageTypes.ERR, `Entry name not found. Try one of: ${allAssetsNames.join(' ')}`, MessageTags.START_SERVER_PLUGIN)
}

export const printSspError = (): void => {
  printMessage(MessageTypes.ERR, 'Error.', MessageTags.START_SERVER_PLUGIN)
}
