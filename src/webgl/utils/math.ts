export function random(min: number, max: number) {
  return Math.random() * (max - min) + min
}

/**
 * 近似正态分布的随机数生成器
 */
export function randomGaussian(loop = 3) {
  let sum = 0.0
  for (let i = 0; i < loop; i += 1) {
    sum = sum + Math.random()
  }
  return sum / loop
}
