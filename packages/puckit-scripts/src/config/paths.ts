import { resolve } from 'path'
import { realpathSync } from 'fs'

const appDirectory = realpathSync(process.cwd())
const resolveApp = (relativePath: string) => resolve(appDirectory, relativePath)

export const moduleFileExtensions = [
  '.web.mjs',
  '.mjs',
  '.web.js',
  '.js',
  '.web.jsx',
  '.jsx',
  '.web.ts',
  '.ts',
  '.web.tsx',
  '.tsx',
  '.json',
]

export const appPath = resolveApp('.')
export const appLib = resolveApp('lib')
export const appDist = resolveApp('dist')
export const appSrc = resolveApp('src')
export const appServer = resolveApp('server')
export const appPublic = resolveApp('public')
export const appHtml = resolveApp('public/index.html')
