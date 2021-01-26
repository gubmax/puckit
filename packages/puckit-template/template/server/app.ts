import Koa from 'koa'
import cors, { Options } from '@koa/cors'
import { MessageTypes, printMessage, clearConsole } from '@puckit/dev-utils'

import router from './router'

const app = new Koa()

const corsOptions: Options = {
  origin: '*',
}

app.use(cors(corsOptions))
app.use(router.routes())

app.on('error', (err: Error) => {
  clearConsole()
  printMessage(MessageTypes.ERR, 'Server side error')
  console.error(err)
})

export default app
