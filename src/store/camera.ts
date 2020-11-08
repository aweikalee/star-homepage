import { reactive, readonly } from 'vue'

const state = reactive({
  /* 显示星座 */
  constellation: true,
})

export const camera = readonly(state)

export function setCameraConstellation(value: boolean) {
  state.constellation = value
}
