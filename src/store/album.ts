import { computed, reactive, readonly } from 'vue'
import { variable } from '../config'
import { equivalentFov } from '../utils'
import { glstate } from './glstate'

export type ITakePhoto = () => HTMLCanvasElement | void
export type IPhoto = {
  src: string
  w: number
  h: number
}

/* 拍摄照片 尺寸 */
// offset 是指拍摄区域的中心 相对于整个画布中心的偏移量
// 比如 拍摄区域略微偏上
// 如果直接按拍摄区域尺寸进行渲染
// 渲染的中心会在画布的中心
// 而实际用户看到的渲染中心应该是在拍摄区域偏下的位置
// 为此补上偏移的范围的尺寸再渲染，使两个中心重叠
// 然后再根据偏移重新裁剪
const view = computed(() => {
  const view = glstate.view
  const imageQuality = variable.album.imageQuality
  const aspect = view.w / view.h

  // 输出尺寸
  const w = (Math.sqrt(imageQuality * aspect) >> 1) << 1
  const h = ((w / aspect) >> 1) << 1

  const ratio = w / view.w

  // 偏移量
  const offsetX = 0 * ratio
  const offsetY = 0 * ratio

  // 渲染时尺寸、视野范围
  const renderW = w + Math.abs(offsetX)
  const renderH = h + Math.abs(offsetY)
  const renderFov = equivalentFov(view.fov, h, renderH)

  return { w, h, offsetX, offsetY, renderW, renderH, renderFov }
})

const state = reactive({
  /* photo */
  view,
  photos: [] as IPhoto[],
  pushPhoto(value: IPhoto) {
    state.photos.push(value)
  },

  /* TheAlbum */
  buttonElement: null as HTMLElement | null,
  setButtonElement(el: HTMLElement | null) {
    state.buttonElement = el
  },
})

export const album = readonly(state)
