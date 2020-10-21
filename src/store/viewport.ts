import { reactive, readonly } from 'vue'

const state = reactive({
  w: (window.innerWidth >> 1) << 1,
  h: (window.innerHeight >> 1) << 1,
})

export const viewport = readonly(state)

addEventListener('resize', () => {
  state.w = (window.innerWidth >> 1) << 1
  state.h = (window.innerHeight >> 1) << 1
})
