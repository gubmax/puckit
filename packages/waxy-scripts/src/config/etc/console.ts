import {
  clearConsole, printMessage, MessageType, boldText,
} from '@waxy/dev-utils'

import { appPath } from '../paths'

const appName = require(`${appPath}/package.json`).name

export const consoleSuccessMsg = (): void => {
  clearConsole()
  printMessage(MessageType.DONE, 'Compiled successfully!')
  printMessage(MessageType.MAIN, `\nYou can now view ${boldText(appName)} in the browser.\n`)
}

export const consoleLink = (
  name: string, protocol: string, host: string, port: string | number,
): void => (
  printMessage(MessageType.MAIN, `${boldText(name)}: ${protocol}://${host}:${boldText(port)}`)
)
