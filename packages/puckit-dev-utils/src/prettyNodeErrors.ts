import { getTopFrame, getStackTraceLines, separateMessageFromStack } from 'jest-message-util'
import { grayText } from './console'

import useCodeFrame from './getCodeFrame'

export interface PrettyError {
  message?: string;
  stack?: string;
}

function prettyError(error: PrettyError) {
  const { message = '', stack = '' } = error
  const lines = getStackTraceLines(stack)
  const topFrame = getTopFrame(lines)
  const fallback = `${message}\n${stack}`

  if (!topFrame) {
    return fallback
  }

  const { file, line } = topFrame

  if (line === undefined) {
    return fallback
  }

  return `${useCodeFrame(message, file, line)}\n${grayText(stack)}`
}

function usePrettyErrors() {
  const { prepareStackTrace } = Error

  Error.prepareStackTrace = (error, trace) => {
    const prepared = prepareStackTrace
      ? separateMessageFromStack(prepareStackTrace(error, trace))
      : error
    return prettyError(prepared)
  }
}

usePrettyErrors()
