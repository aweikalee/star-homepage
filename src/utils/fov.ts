export function equivalentFov(
  baseFov: number,
  baseSize: number,
  targetSize: number
) {
  const scale = targetSize / baseSize
  const tan = Math.tan(baseFov / 2)
  return 2 * Math.atan(scale * tan) // 弧度
}
