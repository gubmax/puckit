import Webpack, { Configuration, Compiler, Stats } from 'webpack'
import { clearConsole } from '@puckit/dev-utils'

type CreateCompilerProps = {
  webpack: typeof Webpack;
  config: Configuration;
  callback?: (err?: Error, stats?: Stats) => void;
  onCompiling?: () => void;
  onFailedToCompile?: () => void;
  onDoneCompiling?: () => void;
  onDoneCompilingWithWarnings?: () => void;
}

const createCompiler = ({
  webpack, config, callback,
  onCompiling = () => {},
  onFailedToCompile = () => {},
  onDoneCompiling = () => {},
  onDoneCompilingWithWarnings = () => {},
}: CreateCompilerProps) => {
  let compiler: Compiler

  try {
    compiler = webpack(config, callback?.bind(webpack))
  } catch (err) {
    clearConsole()
    onFailedToCompile()
    console.log(err.message || err)
    process.exit(1)
  }

  const { hooks } = compiler

  hooks.invalid.tap('invalid', () => {
    clearConsole()
    onCompiling()
  })

  hooks.failed.tap('failed', (err) => {
    clearConsole()
    onFailedToCompile()
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
      const message = typeof error === 'object' ? error.message : error

      onFailedToCompile()
      console.log(message)
      return false
    }

    if (warnings.length) {
      onDoneCompilingWithWarnings()
      console.log(warnings.join('\n\n'))
    }

    onDoneCompiling()
    return true
  })

  return compiler
}

export default createCompiler
