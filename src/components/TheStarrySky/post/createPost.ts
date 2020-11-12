import { Post, OGLRenderingContext, Vec3 } from 'ogl-typescript'
import desaturate from './desaturate.frag'
import balance from './balance.frag'

export function createPost(gl: OGLRenderingContext) {
  const post = new Post(gl)

  /* 色彩平衡 */
  post.addPass({
    fragment: balance,
    uniforms: {
      uBalance: {
        value: new Vec3(1, 1, 1)
      }
    }
  })

  /* 去色 */
  post.addPass({
    fragment: desaturate,
  })

  return post
}
