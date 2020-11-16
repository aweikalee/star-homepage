import { computed, reactive, readonly } from 'vue'
import { random } from '../webgl/utils'
import { sites, variable } from '../config'
import { glstate } from './glstate'
import { equivalentFov } from '../utils'

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

/* 有效视角范围  */
const validFov = computed(() => {
  const { w, h, fov } = glstate.view
  return {
    x: fov,
    y: equivalentFov(fov, h, w),
  }
})

const focus = computed(() => {
  const { x, y } = glstate.camera.rotation

  /* 获取离当前视角中心最近的目标 */
  const rotationY = getPositiveMod(y + rotationYBase / 2, 2 * Math.PI)
  const index = Math.floor(rotationY / rotationYBase)
  const target = data[index]

  /* 有效视角范围 */
  const fov = validFov.value

  /* 判断目标是否符合在有效区域内 */
  if (Math.abs(target.rotationY + rotationYBase / 2 - rotationY) > fov.y / 2) {
    return null
  }

  if (Math.abs(target.rotationX - x) > fov.x / 2) {
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
  const res = new Float32Array(len * 3)
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
  const len = Math.floor(lines.length / 2) * 2
  const res = new Float32Array(len * 3)

  for (let i = 0; i < len; i += 1) {
    const index = lines[i] * 3
    const position = [points[index], points[index + 1], points[index + 2]]
    res.set(position, i * 3)
  }

  return res
}

function getPositiveMod(value: number, mod: number) {
  const v = value % mod
  return v < 0 ? v + mod : v
}
