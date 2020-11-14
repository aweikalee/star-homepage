import { Vec3 } from 'ogl-typescript'
import { reactive, readonly } from 'vue'

const DELAY = [0, 3000, 10000]

const state = reactive({
  /* 组件可见状态 */
  visible: {
    constellation: true, // 星座
    timer: false, // 定时器
    balance: false, // 色彩平衡
  },

  /* 拍摄延时 */
  delay: DELAY[0],

  /* 色彩平衡 */
  balance: new Vec3(1, 1, 1),

  /* 去色 */
  desaturate: false,
})

export const camera = readonly(state)

export function setCameraVisible(
  key: keyof typeof state.visible,
  value: boolean
) {
  state.visible[key] = value
}

export function toggleCameraVisible(key: keyof typeof state.visible) {
  setCameraVisible(key, !state.visible[key])
}

export function setCameraDelay(value: number) {
  state.delay = value
}

export function toggleCameraDelay() {
  const index = DELAY.indexOf(state.delay) + 1
  setCameraDelay(DELAY[index % DELAY.length])
}

export function setCameraBalance(value: Vec3) {
  state.balance = value
}

export function setCameraDesaturate(value: boolean) {
  state.desaturate = value
}
