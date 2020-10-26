import { Orbit, OrbitOptions, Transform } from 'ogl-typescript'
import { reactive, readonly, computed } from 'vue'
import { variable } from '../config'
import { equivalentFov } from '../utils'
import { viewport } from './viewport'

const fov = computed(() => {
  const {
    fov: { base, mobile },
    phone,
  } = variable
  const { h, isMobileInCSS } = viewport
  if (isMobileInCSS) return mobile
  return equivalentFov(base, phone.w, h)
})

const toPx = computed(() => {
  const ratio = viewport.h / (2 * Math.tan(state.fov / 2))

  /* distance 应为正数 */
  return (x: number, y: number, distance: number) => ({
    x: (x / distance) * ratio,
    y: -(y / distance) * ratio, // 坐标轴 y 方向相反
  })
})

const view = computed(() => {
  const { w, h, isMobileInCSS, orientation } = viewport
  const { phone } = variable

  if (isMobileInCSS) return { w, h }

  if (orientation === 'portrait') {
    return phone
  } else {
    return {
      w: phone.h,
      h: phone.w,
    }
  }
})

const state = reactive({
  fov,
  toPx,
  view,
  camera: new Transform(),
})

export const glstate = readonly(state)

/* transform */
const transform = new Transform()
transform.position.set(0, 0, 1)
const controls = new (Orbit as any)(transform, {
  ease: 0.5, // 缓动
  enableZoom: false, // 允许缩放
  enablePan: false, // 允许平移
  rotateSpeed: -0.03, // 旋转速度
  autoRotate: true, // 自动转动
  autoRotateSpeed: 0.06, // 自动转动速度
  minPolarAngle: Math.PI / 2 - variable.fov.base / 2, // 最小纵向视角
  maxPolarAngle: Math.PI / 2 + variable.fov.base / 2, // 最大纵向视角
} as OrbitOptions)
function updateControls() {
  requestAnimationFrame(updateControls)
  controls.update()
  state.camera.lookAt(transform.position)
}
updateControls()