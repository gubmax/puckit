import { RouterContext } from 'koa-router'

const getData = (ctx: RouterContext) => {
  ctx.body = 'This text from the server appears before the bundle is loaded!'
}

export default getData
