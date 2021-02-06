import fs from 'fs'
import { codeFrameColumns } from '@babel/code-frame'

function useCodeFrame(
  fallback: string, file: string, line: number, column?: number,
) {
  try {
    const frame = codeFrameColumns(
      fs.readFileSync(file, 'utf8'),
      { start: { line, column } },
      { highlightCode: true },
    )
    return `${fallback}\n\n${frame}\n`
  } catch (err) {
    return fallback
  }
}

export default useCodeFrame
