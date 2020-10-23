import { Orbit, OrbitOptions, Transform } from 'ogl-typescript'
import { reactive, readonly, computed } from 'vue'
import { variable } from '../config'
import { viewport } from './viewport'

const fov = computed(() => {
  const { baseFov, mobileFov, phone } = variable
  const { h, isMobileInCSS } = viewport
  if (isMobileInCSS) return mobileFov

  const scale = h / phone.w
  const tan = Math.tan(baseFov / 2)
  return 2 * Math.atan(scale * tan) // 弧度
})

const state = reactive({
  get fov() {
    return fov.value
  },
  transform: new Transform(),
})

export const glstate = readonly(state)

/* transform */
/**
 * 原本 Orbit 是控制摄像机位置，并让摄像机 lookAt([0, 0, 0])
 * 此处逻辑变更为令摄像机 lookAt(transform.position)
 * 故 posision 的 y 需要反转为 -y
 * 即 camera.lookAt([x, -y, z])
 *
 * 另外如此修改后 transform.rotation 就等同于 camera.rotation，
 * 否则 rotation 还需要进行一次反转 （+ Math.PI）
 */
state.transform.position.set(0, 0, 1)
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
