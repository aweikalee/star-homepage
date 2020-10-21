import { Color } from 'ogl-typescript'

export function mixColor(c1: number, c2: number, ratio: number) {
  const rgb1 = new Color(c1).map((v) => v * ratio)
  const rgb2 = new Color(c2).map((v) => v * (1 - ratio))
  return rgb1.map((v, i) => v + rgb2[i])
}

function rgbToHsv(rgb: number[]) {
  const [r, g, b] = rgb
  const max = Math.max(...rgb)
  const min = Math.min(...rgb)
  const delta = max - min
  const p = Math.PI / 3

  let h: number
  const s = max === 0 ? 0 : delta / max
  const v = max

  if (delta === 0) {
    h = 0
  } else if (max === r) {
    h = p * (((g - b) / delta) % 6)
  } else if (max === g) {
    h = p * ((b - r) / delta + 2)
  } else {
    h = p * ((r - g) / delta + 4)
  }

  return [h, s, v]
}

function hsvToRgb(hsv: number[]) {
  const p = Math.PI / 3
  const [h, s, v] = hsv

  const c = v * s
  const x = c * (1 - Math.abs(((h / p) % 2) - 1))
  const m = v - c

  const [r, g, b] = [
    [c, x, 0],
    [x, c, 0],
    [0, c, x],
    [0, x, c],
    [x, 0, c],
    [c, 0, x],
  ][Math.floor((h / p) % 6)]

  return [r + m, g + m, b + m]
}

export function createChromaScale(c1: number, c2: number) {
  const rgb1 = new Color(c1)
  const rgb2 = new Color(c2)
  const hsv1 = rgbToHsv(rgb1)
  const hsv2 = rgbToHsv(rgb2)
  if (hsv1[0] > hsv2[0]) {
    hsv2[0] += Math.PI * 2
  }

  return (position: number) => {
    const hsv = hsv1.map((v, i) => v * position + hsv2[i] * (1 - position))
    return hsvToRgb(hsv)
  }
}
