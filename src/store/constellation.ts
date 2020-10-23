import { reactive, readonly } from 'vue'
import { random } from '../webgl/utils'
import { sites, variable } from '../config'

const baseFov = variable.fov.base
const rotationYBase = (2 * Math.PI) / sites.length
const data = sites.map((site, i) => {
  const points = initPoints(site.points)
  const lines = initLines(site.lines, points)

  return {
    ...site,
    points,
    lines,
    rotationY: rotationYBase * i,
    rotationX: baseFov * random(-0.5, 0.5),
  }
})

const state = reactive({
  data,
})

export const constellation = readonly(state)

function initPoints(points: number[]) {
  const len = Math.floor(points.length / 2)
  const res = new Float32Array(len * 3 + 3)
  const {
    constellation: { scale, near, far },
  } = variable

  for (let i = 0; i < len; i += 1) {
    const index = i * 2
    const position = [
      points[index],
      points[index + 1],
      -random(near, far) / scale,
    ].map((v) => v * scale)
    res.set(position, i * 3)
  }
  res.set([0, 0, -6], len * 3)

  return res
}

function initLines(lines: number[], points: ArrayLike<number>) {
  let _lines = lines
  if (lines.length === 0) {
    const len = Math.floor(points.length / 3)
    _lines = []
    for (let i = 0; i < len; i += 1) {
      _lines.push(i === 0 ? len - 1 : i - 1)
      _lines.push(i)
    }
  }

  const len = Math.floor(_lines.length / 2) * 2
  const res = new Float32Array(len * 3)

  for (let i = 0; i < len; i += 1) {
    const index = _lines[i] * 3
    const position = [points[index], points[index + 1], points[index + 2]]
    res.set(position, i * 3)
  }

  return res
}
