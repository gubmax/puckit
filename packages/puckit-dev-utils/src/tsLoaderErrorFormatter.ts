import { boldText } from './console'
import useCodeFrame from './getCodeFrame'

interface TsLoaderError {
  code: number,
  severity: string,
  content: string,
  file: string,
  line: number,
  character: number,
}

function prettyTsLoaderErrorFormatter({
  severity, content, file, line, character,
}: TsLoaderError) {
  const type = severity[0].toUpperCase() + severity.slice(1)
  const fallback = `${type} in ${file} (${line}:${character})\n\n${boldText(content)}`

  return useCodeFrame(fallback, file, line, character)
}

export default prettyTsLoaderErrorFormatter
