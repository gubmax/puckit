import { MessageTypes, printMessage } from './console'

const START_SERVER_PLUGIN = 'puckit:start-server-plugin'

export function printSspArgument(): void {
  printMessage(MessageTypes.ERR, 'Argument must be a string', START_SERVER_PLUGIN)
}

export function printSspEntryNameNotFound(allAssetsNames: string[]): void {
  printMessage(MessageTypes.ERR, `Entry name not found. Try one of: ${allAssetsNames.join(' ')}`, START_SERVER_PLUGIN)
}

export function printSspError(): void {
  printMessage(MessageTypes.ERR, 'Error', START_SERVER_PLUGIN)
}
