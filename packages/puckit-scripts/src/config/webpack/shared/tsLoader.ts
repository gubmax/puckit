import { tsLoaderErrorFormatter } from '@puckit/dev-utils'

const tsLoader = {
  loader: 'ts-loader',
  options: {
    colors: false,
    errorFormatter: tsLoaderErrorFormatter,
  },
}

export default tsLoader
