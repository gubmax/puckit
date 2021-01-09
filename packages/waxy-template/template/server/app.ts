import Koa from 'koa'
import cors, { Options } from '@koa/cors'
import { MessageType, printMessage, clearConsole } from 'modern-app-dev-utils'

import router from './router'

const app = new Koa()

const corsOptions: Options = {
  origin: '*',
}

app.use(cors(corsOptions))
app.use(router.routes())

app.on('error', (err: Error) => {
  clearConsole()
  printMessage(MessageType.ERR, 'Server side error')
  console.error(err)
})

export default app
