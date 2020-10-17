import { reactive, readonly } from 'vue'

const state = reactive({
  w: window.innerWidth,
  h: window.innerHeight,
})

export const viewport = readonly(state)

addEventListener('resize', () => {
  state.w = window.innerWidth
  state.h = window.innerHeight
})
