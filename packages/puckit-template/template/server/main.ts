import Fastify, { FastifyInstance } from 'fastify'

import { useRouter } from './router'

export function bootstrap() {
  const server: FastifyInstance = Fastify({})
  useRouter(server)

  server.listen(process.env.APP_SERVER_PORT || 8000)
  return server
}
