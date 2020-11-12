import { OGLRenderingContext } from 'ogl-typescript'
import { constellation } from '../../../store'
import { createTextureStar } from '../../../webgl/texture/createTextureStar'
import { createParticles } from '../../../webgl/object/createParticles'
import { mixColor } from '../../../webgl/utils'

export async function createConstellations(gl: OGLRenderingContext) {
  return await Promise.all(
    constellation.data.map((site) => createConstellation(gl, site))
  )
}

export async function createConstellation(
  gl: OGLRenderingContext,
  site: typeof constellation.data[0]
) {
  const { points, rotationY, rotationX } = site
  const len = Math.floor(points.length / 3)
  const texture = createTextureStar(gl)
  const color = () => mixColor(0xffffff, 0x73e3ff, Math.random())

  const colors = new Float32Array(len * 3)
  const opacities = new Float32Array(len)
  const randoms = new Float32Array(len)
  const sizes = new Float32Array(len)

  for (let i = 0; i < len; i += 1) {
    colors.set(color(), i * 3)
    opacities.set([1], i)
    randoms.set([0], i)
    sizes.set([60], i)
  }

  const paticles = createParticles(gl, {
    positions: points,
    colors,
    opacities,
    randoms,
    sizes,
    texture,
  })

  paticles.rotation.x += rotationX
  paticles.rotation.y += rotationY

  return paticles
}
