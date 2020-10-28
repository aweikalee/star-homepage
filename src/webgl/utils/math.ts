export function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

/**
 * 近似正态分布的随机数生成器
 */
export function randomGaussian() {
  const loop = 3
  let sum = 0.0
  for (let i = 0; i < loop; i += 1) {
    sum = sum + Math.random()
  }
  return sum / loop
}

/**
 * 创建单位长度的向量
 * 使用球坐标进行计算，输出时再转成直角坐标
 * @param u 影响 θ
 * @param v 影响 φ
 */
export function createUnitVector(
  u: number = Math.random(),
  v: number = Math.random()
): [number, number, number] {
  const theta = 2 * Math.PI * u
  const phi = Math.acos(2 * v - 1)

  const x = Math.sin(theta) * Math.sin(phi)
  const y = Math.cos(theta) * Math.sin(phi)
  const z = Math.cos(phi)

  return [x, y, z]
}
