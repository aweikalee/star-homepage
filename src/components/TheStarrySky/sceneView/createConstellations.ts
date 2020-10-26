import { Color, OGLRenderingContext } from 'ogl-typescript'
import { constellation, viewport } from '../../../store'
import { createTextureStar } from '../../../webgl/texture/createTextureStar'
import { createParticles } from '../../../webgl/object/createParticles'
import { createLines } from '../../../webgl/object/createLines'
import { computed } from 'vue'

export async function createConstellations(gl: OGLRenderingContext) {
  return (
    await Promise.all(
      constellation.data.map((site) => createConstellation(gl, site))
    )
  ).reduce((prev, cur) => {
    return prev.concat(cur)
  }, [])
}

const COLOR = new Color(0x76c4ff)
const uHeight = computed(() => viewport.h)
export async function createConstellation(
  gl: OGLRenderingContext,
  site: typeof constellation.data[0]
) {
  const { points, lines, rotationY, rotationX } = site
  const len = Math.floor(points.length / 3)
  const texture = createTextureStar(gl)

  const colors = new Float32Array(len * 4)
  const sizes = new Float32Array(len)
  const opacities = new Float32Array(len)

  for (let i = 0; i < len; i += 1) {
    colors.set(COLOR, i * 3)
    opacities.set([1], i)
    sizes.set([80], i)
  }

  const paticles = createParticles(gl, {
    positions: points,
    colors,
    opacities,
    sizes,
    texture,
    uHeight,
  })

  const line = createLines(gl, {
    positions: lines,
    color: COLOR,
    opacity: 1,
  })

  return [paticles, line].map((v) => {
    v.rotation.x += rotationX
    v.rotation.y += rotationY
    return v
  })
}
