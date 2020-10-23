import { OGLRenderingContext } from 'ogl-typescript'
import { computed } from 'vue'
import { viewport } from '../../../store'
import { createSphereData } from '../../../webgl/utils/createSphereData'
import { createTextureStar } from '../../../webgl/texture/createTextureStar'
import { createChromaScale, random } from '../../../webgl/utils'
import { createParticles } from '../../../webgl/object/createParticles'

const uHeight = computed(() => viewport.h)
export async function createStar(gl: OGLRenderingContext) {
  const texture = createTextureStar(gl)

  const chroma = createChromaScale(0xff8080, 0x8080ff)
  const main = createParticles(gl, {
    texture,
    uHeight,
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
