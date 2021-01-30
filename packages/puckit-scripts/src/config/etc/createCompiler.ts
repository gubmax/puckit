import { clearConsole } from '@puckit/dev-utils'
import Webpack, { Configuration, Compiler, Stats } from 'webpack'

import noop from '../helpers/noop'

type CreateCompilerProps = {
  webpack: typeof Webpack;
  config: Configuration;
  callback?: (err?: Error, stats?: Stats) => void;
  onInvalid: () => void;
  onAfterCompile?: () => void,
  onFailed?: () => void;
  onWarning?: () => void;
  onSuccess?: () => void;
}

const createCompiler = ({
  webpack, config, callback,
  onInvalid = noop,
  onAfterCompile = noop,
  onFailed = noop,
  onWarning = noop,
  onSuccess = noop,
}: CreateCompilerProps) => {
  let compiler: Compiler

  try {
    compiler = webpack(config, callback?.bind(webpack))
  } catch (err) {
    onFailed()
    console.log(err.message || err)
    process.exit(1)
  }

  const { hooks } = compiler

  hooks.invalid.tap('invalid', onInvalid)

  hooks.afterCompile.tap('afterCompile', onAfterCompile)

  hooks.failed.tap('failed', (err) => {
    onFailed()
    console.log(err)
  })

  hooks.done.tap('done', (stats) => {
    const { errors, warnings } = stats.compilation

    if (errors.length || warnings.length) {
      clearConsole()
    }

    if (errors.length) {
      if (errors.length > 1) {
        errors.length = 1
      }

      const error: { message: string } | string = errors[0]
      const message = error instanceof Object ? error.message : error

      onFailed()
      console.log(message)
      return
    }

    if (warnings.length) {
      onWarning()
      console.log(warnings.join('\n\n'))
      return
    }

    onSuccess()
  })

  return compiler
}

export default createCompiler
