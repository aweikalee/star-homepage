import { reactive, readonly } from 'vue'

export type IOrientation = 'portrait' | 'landscape'

const state = reactive({
  w: (window.innerWidth >> 1) << 1,
  h: (window.innerHeight >> 1) << 1,
  orientation:
    window.innerHeight >= window.innerWidth ? 'portrait' : 'landscape',
})

export const viewport = readonly(state)

addEventListener('resize', () => {
  const w = window.innerWidth
  const h = window.innerHeight
  state.w = (w >> 1) << 1
  state.h = (h >> 1) << 1
  state.orientation = h >= w ? 'portrait' : 'landscape'
})
