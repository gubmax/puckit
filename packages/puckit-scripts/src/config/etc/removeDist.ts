import { existsSync, readdirSync, unlinkSync } from 'fs'
import path from 'path'

import { appDist } from '../paths'
import { printRemoveFiles } from './messages'

function removeDist(): void {
  if (!existsSync(appDist)) {
    return
  }

  printRemoveFiles(appDist)

  readdirSync(appDist).forEach((file) => {
    unlinkSync(path.join(appDist, file))
  })
}

export default removeDist
