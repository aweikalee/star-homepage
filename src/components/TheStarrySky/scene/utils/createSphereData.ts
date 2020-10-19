import { createUnitVector } from './math'

export interface ISphereOptions {
  color: () => number[]
  opacity: () => number
  quantity: number
  radius: () => number
  size: () => number
  u?: () => number
  v?: () => number
}

export async function createSphereData(options: ISphereOptions) {
  const { color, opacity, quantity, size } = options

  const positions = new Float32Array(quantity * 3)
  const colors = new Float32Array(quantity * 3)
  const opacities = new Float32Array(quantity)
  const sizes = new Float32Array(quantity)

  const helper = async (i: number) => {
    colors.set(color(), i * 3)
    opacities.set([opacity()], i)
    positions.set(createPosition(options), i * 3)
    sizes.set([size()], i)
  }

  for (let i = 0; i < quantity; i += 1) {
    await helper(i)
  }

  return {
    colors,
    opacities,
    positions,
    sizes,
  }
}

function createPosition({ radius, u, v }: ISphereOptions) {
  const r = radius()
  return createUnitVector(u?.(), v?.()).map((v) => v * r)
}
