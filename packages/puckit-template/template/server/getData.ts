import { RouterContext } from 'koa-router'

function getData(ctx: RouterContext): void {
  ctx.body = 'This text from the server appears before the bundle is loaded!'
}

export default getData
