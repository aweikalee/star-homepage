import { Vec3 } from 'ogl-typescript'
import { reactive, readonly } from 'vue'

const DELAY = [0, 3000, 10000]

const visible = {
  album: false, // 相册
  balance: false, // 色彩平衡
  constellation: true, // 星座
  list: false, // 列表
  timer: false, // 定时器
}

const state = reactive({
  /* 组件可见状态 */
  visible,
  setVisible(key: keyof typeof visible, value: boolean) {
    state.visible[key] = value
  },
  toggleVisible(key: keyof typeof visible) {
    state.setVisible(key, !state.visible[key])
  },

  /* 色彩平衡 */
  balance: new Vec3(1, 1, 1),
  setBalance(value: Vec3) {
    state.balance = value
  },

  /* 拍摄延时 */
  delay: DELAY[0],
  setDelay(value: number) {
    state.delay = value
  },
  toggleDelay() {
    const index = DELAY.indexOf(state.delay) + 1
    state.setDelay(DELAY[index % DELAY.length])
  },

  /* 去色 */
  desaturate: false,
  setDesaturate(value: boolean) {
    state.desaturate = value
  },

  /* 前置摄像头 */
  frontCamera: false,
  setFrontCamera(value: boolean) {
    state.frontCamera = value
  },
  toggleFrontCamera() {
    state.setFrontCamera(!state.frontCamera)
  },
})

export const camera = readonly(state)
