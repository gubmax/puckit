import chalk, { ForegroundColor } from 'chalk'
import LogSymbols from 'log-symbols'

export enum MessageTypes {
  MAIN = 'MAIN',
  INFO = 'INFO',
  DONE = 'DONE',
  WARN = 'WARN',
  ERR = 'ERR',
}

export const boldText = (text: string | number): string => chalk.bold(text)
export const grayText = (text: string | number): string => chalk.gray(text)

export const printMessage = (type: MessageTypes, text: string, tag?: string): void => {
  const colorByType: Record<string, typeof ForegroundColor> = {
    [MessageTypes.INFO]: 'blue',
    [MessageTypes.DONE]: 'green',
    [MessageTypes.WARN]: 'yellow',
    [MessageTypes.ERR]: 'red',
  }

  const iconByType = {
    [MessageTypes.INFO]: LogSymbols.info,
    [MessageTypes.DONE]: LogSymbols.success,
    [MessageTypes.WARN]: LogSymbols.warning,
    [MessageTypes.ERR]: LogSymbols.error,
  }

  const color = colorByType[type]
  let message = text

  if (type !== MessageTypes.MAIN) {
    const tagStr = tag ? ` ${grayText(`[${tag}]`)}:` : ''
    message = `${iconByType[type]}${tagStr} ${chalk[color](text)}`
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
