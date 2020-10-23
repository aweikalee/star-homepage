import { computed } from 'vue'
import { OGLRenderingContext } from 'ogl-typescript'
import { constellation, viewport } from '../../../store'
import { createTextureStar } from '../../../webgl/texture/createTextureStar'
import { createParticles } from '../../../webgl/object/createParticles'
import { createChromaScale } from '../../../webgl/utils'

export async function createConstellations(gl: OGLRenderingContext) {
  return await Promise.all(
    constellation.data.map((site) => createConstellation(gl, site))
  )
}

const chroma = createChromaScale(0xff8080, 0x8080ff)
const uHeight = computed(() => viewport.h)
export async function createConstellation(
  gl: OGLRenderingContext,
  site: typeof constellation.data[0]
) {
  const { points, rotationY, rotationX } = site
  const len = Math.floor(points.length / 3)
  const texture = createTextureStar(gl)

  const colors = new Float32Array(len * 4)
  const sizes = new Float32Array(len)
  const opacities = new Float32Array(len)

  for (let i = 0; i < len; i += 1) {
    colors.set(chroma(Math.random()), i * 3)
    opacities.set([1], i)
    sizes.set([60], i)
  }

  const paticles = createParticles(gl, {
    positions: points,
    colors,
    opacities,
    sizes,
    texture,
    uHeight
  })

  paticles.rotation.x += rotationX
  paticles.rotation.y += rotationY

  return paticles
}
