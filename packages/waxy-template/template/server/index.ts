import http from 'http'
import fetch from 'node-fetch'

import app from './app'

const server = http.createServer(app.callback())

global.fetch = fetch

server.listen(process.env.APP_SERVER_PORT || 8000)

export default server
