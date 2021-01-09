import Router from 'koa-router'

import getData from './getData'
import serverRenderer from './serverRenderer'

const router = new Router()

router
  .post('/api/data', getData)
  .get('/', serverRenderer)

export default router
