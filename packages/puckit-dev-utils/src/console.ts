import chalk, { ForegroundColor } from 'chalk'
import logSymbols from 'log-symbols'
import ora from 'ora'

import noop from './helpers/noop'

export enum MessageTypes {
  MAIN = 'MAIN',
  INFO = 'INFO',
  DONE = 'DONE',
  WARN = 'WARN',
  ERR = 'ERR',
}

export const boldText = (text: string | number): string => chalk.bold(text)
export const grayText = (text: string | number): string => chalk.gray(text)

interface GetMessageArg {
  type: MessageTypes
  text: string
  tag?: string
  withoutIcon?: boolean
}

export const getMessage = ({
  type, text, tag, withoutIcon = false,
}: GetMessageArg): string => {
  const colorByType: Record<string, typeof ForegroundColor> = {
    [MessageTypes.DONE]: 'green',
    [MessageTypes.WARN]: 'yellow',
    [MessageTypes.ERR]: 'red',
  }

  const iconByType: {[key in MessageTypes]?: string} = {
    [MessageTypes.INFO]: logSymbols.info,
    [MessageTypes.DONE]: logSymbols.success,
    [MessageTypes.WARN]: logSymbols.warning,
    [MessageTypes.ERR]: logSymbols.error,
  }

  const icon = iconByType[type]
  const iconStr = withoutIcon || !icon ? '' : `${iconByType[type]} `

  const tagStr = tag ? `${grayText(`｢${tag}｣`)}: ` : ''

  const color = colorByType[type]
  const solorStr = color ? chalk[color](text) : text

  return `${iconStr}${tagStr}${solorStr}`
}

export const printMessage = (type: MessageTypes, text: string, tag?: string): void => {
  const message = getMessage({ type, text, tag })
  console.log(message)
}

export const isInteractive = (): boolean => process.stdout.isTTY

export interface Spinner {
  start: () => void,
  stop: () => void,
}

export const printMessageWithSpinner = (
  type: MessageTypes, text: string, tag?: string,
): Spinner => {
  const message = getMessage({
    type, text, tag, withoutIcon: true,
  })
  const spinner = ora({ color: 'yellow', text: message })

  if (isInteractive()) {
    return {
      start: () => spinner.start(),
      stop: () => {
        if (spinner.isSpinning) {
          spinner.info()
        }
      },
    }
  }

  return {
    start: () => printMessage(type, text, tag),
    stop: noop,
  }
}

export const clearConsole = (): void => {
  const output = process.platform === 'win32' ? '\x1B[2J\x1B[0f' : '\x1B[2J\x1B[3J\x1B[H'

  if (isInteractive()) {
    process.stdout.write(output)
  }
}
