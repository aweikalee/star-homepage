import { computed, reactive, readonly } from 'vue'
import { random } from '../webgl/utils'
import { sites, variable } from '../config'
import { glstate } from './glstate'
import { viewport } from './viewport'
import { equivalentFov } from '../utils'

const baseFov = variable.fov.base
const mobileFov = variable.fov.mobile
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

const equivalentBaseFov = equivalentFov(
  baseFov,
  variable.phone.w,
  variable.phone.h
)
const focus = computed(() => {
  const { x, y } = glstate.camera.rotation

  /* 获取离当前视角中心最近的目标 */
  const rotationY = getPositiveMod(y + rotationYBase / 2, 2 * Math.PI)
  const index = Math.floor(rotationY / rotationYBase)
  const target = data[index]

  /* 有效视角范围 */
  const validFov = getValidFov()

  /* 判断目标是否符合在有效区域内 */
  if (
    Math.abs(target.rotationY + rotationYBase / 2 - rotationY) >
    validFov.y / 2
  ) {
    return null
  }

  if (Math.abs(target.rotationX - x) > validFov.x / 2) {
    return null
  }

  return target
})

const state = reactive({
  data,
  focus,
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

function getPositiveMod(value: number, mod: number) {
  const v = value % mod
  return v < 0 ? v + mod : v
}

function getValidFov() {
  const { w, h, isMobileInCSS, orientation } = viewport

  let x: number
  let y: number
  if (isMobileInCSS) {
    x = mobileFov
    y = equivalentFov(mobileFov, h, w)
  } else {
    if (orientation === 'portrait') {
      x = equivalentBaseFov
      y = baseFov
    } else {
      x = baseFov
      y = equivalentBaseFov
    }
  }

  return { x, y }
}
