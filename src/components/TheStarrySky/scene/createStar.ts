import { OGLRenderingContext } from 'ogl-typescript'
import { createSphereData } from './utils/createSphereData'
import { createTextureStar } from './texture/createTextureStar'
import { createChromaScale, random } from './utils'
import { createParticles } from './object/createParticles'

export async function createStar(gl: OGLRenderingContext) {
  const texture = createTextureStar(gl)

  const chroma = createChromaScale(0xff8080, 0x8080ff)
  const main = createParticles(gl, {
    texture,
    ...(await createSphereData({
      quantity: 2000,
      color: () => chroma(Math.random()),
      opacity: () => 0.9,
      radius: () => random(15, 40),
      size: () => 100,
    })),
  })

  return [main]
}
