import { reactive, readonly } from 'vue'
import { variable } from '../config'

export type IOrientation = 'portrait' | 'landscape'

const state = reactive({
  w: 0,
  h: 0,
  orientation: 'portrait' as IOrientation,
  isMobileInCSS: false,
})

export const viewport = readonly(state)

const { w: boundaryW, h: boundaryH } = variable.screenBoundary
const init = () => {
  const w = window.innerWidth
  const h = window.innerHeight
  state.w = (w >> 1) << 1
  state.h = (h >> 1) << 1
  state.orientation = h >= w ? 'portrait' : 'landscape'
  state.isMobileInCSS = w < boundaryW || h < boundaryH
}
init()
addEventListener('resize', init)
