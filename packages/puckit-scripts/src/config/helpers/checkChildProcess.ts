import { ForkMessages } from '../constants'

function checkChildProcess() {
  return process.argv[2] === ForkMessages.CHILD_PROCESS
}

export default checkChildProcess
