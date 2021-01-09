import chalk, { ForegroundColor } from 'chalk'
import LogSymbols from 'log-symbols'

export enum MessageType {
  MAIN = 'MAIN',
  INFO = 'INFO',
  DONE = 'DONE',
  WARN = 'WARN',
  ERR = 'ERR',
}

export const boldText = (text: string | number): string => chalk.bold(text)

export const printMessage = (type: MessageType, text: string): void => {
  const colorByType: Record<string, typeof ForegroundColor> = {
    [MessageType.INFO]: 'blue',
    [MessageType.DONE]: 'green',
    [MessageType.WARN]: 'yellow',
    [MessageType.ERR]: 'red',
  }

  const iconByType = {
    [MessageType.INFO]: LogSymbols.info,
    [MessageType.DONE]: LogSymbols.success,
    [MessageType.WARN]: LogSymbols.warning,
    [MessageType.ERR]: LogSymbols.error,
  }

  const color = colorByType[type]
  let message = text

  if (type !== MessageType.MAIN) {
    message = `${iconByType[type]} ${chalk[color](text)}`
  }

  console.log(message)
}

export const isInteractive = (): boolean => process.stdout.isTTY

export const clearConsole = (): void => {
  const output = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'

  if (isInteractive()) {
    process.stdout.write(output)
  }
}
