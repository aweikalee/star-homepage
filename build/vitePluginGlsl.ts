import { Plugin } from 'vite'
import * as fs from 'fs-extra'
import * as Koa from 'koa'
import { dataToEsm } from 'rollup-pluginutils'

const reg = /\.(glsl|frag|vert)$/

async function getBody(path: string) {
  return dataToEsm((await fs.readFile(path)).toString())
}

export default <Plugin>{
  configureServer({ app, resolver }) {
    ;(app as Koa).use(async (ctx, next) => {
      if (reg.test(ctx.path)) {
        const path = resolver.requestToFile(ctx.path)
        ctx.type = 'js'
        ctx.body = await getBody(path)
      } else {
        await next()
      }
    })
  },
  transforms: [
    {
      test({ path }) {
        return reg.test(path)
      },
      async transform({ path }) {
        return await getBody(path)
      },
    },
  ],
}
