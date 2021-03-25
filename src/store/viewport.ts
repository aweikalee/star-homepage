import { reactive, readonly } from 'vue'
import { variable, dom } from '../config'
import { throttle } from '../utils'

export type IOrientation = 'portrait' | 'landscape'

const state = reactive({
  w: 1,
  h: 1,
  orientation: 'portrait' as IOrientation,
  isMobileInCSS: false,
})

export const viewport = readonly(state)

const { w: boundaryW, h: boundaryH } = variable.screenBoundary
const resize = () => {
  const w = window.innerWidth
  const h = window.innerHeight

  dom.root.style.width = `${w}px`
  dom.root.style.height = `${h}px`
  window.scrollTo({ top: 0 })

  state.w = (w >> 1) << 1
  state.h = (h >> 1) << 1
  state.orientation = h >= w ? 'portrait' : 'landscape'
  state.isMobileInCSS = w < boundaryW || h < boundaryH
}
resize()
addEventListener('resize', throttle(resize))
