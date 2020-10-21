import { Orbit, OrbitOptions, Transform } from 'ogl-typescript'
import { reactive, readonly, watch } from 'vue'
import { viewport } from './viewport'

const state = reactive({
  fov: 30,
  transform: new Transform(),
})

export const glstate = readonly(state)

/* fov */
watch(
  () => viewport.h,
  (h) => {
    const scale = Math.max(h / 450, 1)
    const alpha = (30 * Math.PI) / 180
    const tanAlpha = Math.tan(alpha / 2)
    const beta = 2 * Math.atan(scale * tanAlpha)
    const fov = (beta * 180) / Math.PI

    state.fov = fov
  },
  { immediate: true }
)

/* transform */
state.transform.position.set(0, 0, 0.00001)
const controls = new (Orbit as any)(state.transform, {
  ease: 0.5, // 缓动
  enableZoom: false, // 允许缩放
  enablePan: false, // 允许平移
  rotateSpeed: -0.03, // 旋转速度
  autoRotate: true, // 自动转动
  autoRotateSpeed: 0.06, // 自动转动速度
  minPolarAngle: Math.PI / 2 - Math.PI / 16, // 最小纵向视角
  maxPolarAngle: Math.PI / 2 + Math.PI / 16, // 最大纵向视角
} as OrbitOptions)
function updateControls() {
  requestAnimationFrame(updateControls)
  controls.update()
}
updateControls()