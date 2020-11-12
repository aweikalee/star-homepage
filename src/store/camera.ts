import { Vec3 } from 'ogl-typescript'
import { reactive, readonly } from 'vue'

const DELAY = [0, 3000, 10000]

const state = reactive({
  /* 显示星座 */
  constellation: true,

  /* 拍摄延时 */
  delay: DELAY[0],

  /* 色彩平衡 */
  balance: new Vec3(1, 1, 1),

  /* 去色 */
  desaturate: false,
})

export const camera = readonly(state)

export function setCameraConstellation(value: boolean) {
  state.constellation = value
}

export function toggleCameraConstellation() {
  setCameraConstellation(!state.constellation)
}

export function setCameraDelay(value: number) {
  state.delay = value
}

export function toggleCameraDelay() {
  const index = DELAY.indexOf(state.delay) + 1
  setCameraDelay(DELAY[index % DELAY.length])
}
