import { computed } from 'vue'
import { Color, Mesh, OGLRenderingContext, Texture } from 'ogl-typescript'
import { viewport } from '../../../store'
import {
  createChromaScale,
  random,
  randomGaussian,
  mixColor,
} from '../../../webgl/utils'
import { createParticles } from '../../../webgl/object/createParticles'
import { createTextureSmoke } from '../../../webgl/texture/createTextureSmoke'
import { createTextureDust } from '../../../webgl/texture/createTextureDust'
import {
  createSphereData,
  ISphereOptions,
} from '../../../webgl/utils/createSphereData'

const RADIUS: [number, number][] = [
  [50, 60],
  [60, 65],
  [65, 70],
]

export async function createGalaxy(gl: OGLRenderingContext) {
  const res: Mesh[] = []

  /* 紫光 */
  await helper(gl, {
    color: new Color(0xa154cd),
    opacity: [0.15],
    quantity: 50,
    size: [70000, 12000],
    radius: RADIUS[2],
  }).then((v) => res.push(v))

  /* 蓝光 */
  await helper(gl, {
    color: new Color(0x0066a4),
    opacity: [0.15],
    quantity: 50,
    size: [70000, 12000],
    radius: RADIUS[2],
  }).then((v) => res.push(v))

  /* 绿光 */
  await helper(gl, {
    color: new Color(0x27b872),
    opacity: [0.15],
    quantity: 50,
    size: [70000, 12000],
    radius: RADIUS[2],
    u: () => randomGaussian(),
    v: () => randomGaussian(),
  }).then((v) => res.push(v))

  /* 银河带 黄白色 */
  await helper(gl, {
    color: () => mixColor(0x1c1105, 0xf3e4c3, Math.random()),
    opacity: [0.6],
    size: [5000, 30000],
    u: () => randomGaussian(),
    v: () => 0.4 + randomGaussian() * 0.1,
  }).then((v) => res.push(v))

  /* 银河带 白色 */
  await helper(gl, {
    color: new Color(0xffffff),
    opacity: [0.1],
    quantity: 50,
    size: [10000, 30000],
    u: () => randomGaussian(),
    v: () => 0.3 + randomGaussian() * 0.2,
  }).then((v) => {
    res.push(v)
    v.matrix.rotate(0.2, [1, 0, 0])
  })

  /* 暗星云 主体 */
  await helper(gl, {
    color: new Color(0x1c1105),
    opacity: [0.2],
    quantity: 300,
    texture: createTextureDust(gl),
    size: [5000, 15000],
    u: () => randomGaussian(),
    v: () => 0.4 + randomGaussian() * 0.1,
  }).then((v) => {
    res.push(v)
    v.matrix.rotate(0.1, [1, 0, 0])
  })

  /* 暗星云 扩散 */
  await helper(gl, {
    color: new Color(0x1c1105),
    opacity: [0.1],
    quantity: 300,
    texture: createTextureDust(gl),
    size: [10000, 30000],
    u: () => randomGaussian(),
    v: () => 0.4 + randomGaussian() * 0.2,
  }).then((v) => {
    res.push(v)
    v.matrix.rotate(0.1, [1, 0, 0])
  })

  res.forEach((v) => {
    v.rotation.x += 1.2
    v.rotation.z += 1
  })

  return res
}

const uHeight = computed(() => viewport.h)
async function helper(
  gl: OGLRenderingContext,
  options: {
    color?: ISphereOptions['color'] | number[]
    opacity?: ISphereOptions['opacity'] | number[]
    quantity?: number
    texture?: Texture
    size?: ISphereOptions['size'] | number[]
    radius?: ISphereOptions['radius'] | number[]
    u?: ISphereOptions['u'] | number[]
    v?: ISphereOptions['v'] | number[]
  } = {}
) {
  const {
    color = [1, 1, 1],
    opacity = [1],
    quantity = 100,
    texture = createTextureSmoke(gl),
    size = [70000, 70000],
    radius = RADIUS[1],
    u = [0, 1],
    v = [0, 1],
  } = options

  const createOption = (value: (() => number) | number[]) => {
    if (Array.isArray(value)) {
      if (value.length === 1) {
        return () => value[0]
      } else {
        return () => random(value[0], value[1])
      }
    } else {
      return value
    }
  }

  return createParticles(gl, {
    texture,
    uHeight,
    ...(await createSphereData({
      quantity,
      color: Array.isArray(color) ? () => color : color,
      opacity: createOption(opacity),
      radius: createOption(radius),
      size: createOption(size),
      random: () => Math.random(),
      u: createOption(u),
      v: createOption(v),
    })),
  })
}
