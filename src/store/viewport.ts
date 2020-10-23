import { reactive, readonly } from 'vue'

export type IOrientation = 'portrait' | 'landscape'

const state = reactive({
  w: 0,
  h: 0,
  orientation: 'portrait' as IOrientation,
})

export const viewport = readonly(state)

const init = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  state.w = (w >> 1) << 1
  state.h = (h >> 1) << 1
  state.orientation = h >= w ? 'portrait' : 'landscape'
}
init()
addEventListener('resize', init)
