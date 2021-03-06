import { camera } from './camera'
import { Transform } from 'ogl-typescript'
import { reactive, readonly, computed } from 'vue'
import { variable } from '../config'
import { view } from './view'
import { Orbit } from '../webgl/Orbit'

const toPx = computed(() => {
  const { h, fov } = view.full
  const ratio = h / (2 * Math.tan(fov / 2))

  /* distance 应为正数 */
  return (x: number, y: number, distance: number) => ({
    x: (x / distance) * ratio,
    y: -(y / distance) * ratio, // 坐标轴 y 方向相反
  })
})

const state = reactive({
  toPx,
  camera: new Transform(),
})

export const glstate = readonly(state)

/* transform */
const transform = new Transform()
transform.position.set(0, 0, 1)
const controls = new Orbit(transform, {
  element: document.getElementById('app')!,
  ease: 0.5, // 缓动
  enableZoom: false, // 允许缩放
  enablePan: false, // 允许平移
  rotateSpeed: -0.03, // 旋转速度
  autoRotate: true, // 自动转动
  autoRotateSpeed: 0.06, // 自动转动速度
  minPolarAngle: Math.PI / 2 - variable.fov.base / 2, // 最小纵向视角
  maxPolarAngle: Math.PI / 2 + variable.fov.base / 2, // 最大纵向视角
})
function updateControls() {
  requestAnimationFrame(updateControls)
  controls.update()
  state.camera.lookAt(transform.position)
  if (camera.frontCamera) {
    state.camera.rotation.y += Math.PI
    state.camera.rotation.x *= -1
  }
}
updateControls()
