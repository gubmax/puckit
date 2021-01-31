import { FastifyInstance, RouteShorthandOptions } from 'fastify'

import { DataService } from './DataService'
import { serverRenderer } from './serverRenderer'

const opts: RouteShorthandOptions = {}

export function useRouter(server: FastifyInstance) {
  server.post('/api/data', opts, DataService.getData)
  server.get('*', opts, (response, reply) => {
    reply.type('text/html')
    return serverRenderer()
  })
}
