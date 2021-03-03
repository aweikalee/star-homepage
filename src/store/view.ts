import { computed, reactive, readonly } from 'vue'
import { variable } from '../config'
import { equivalentFov } from '../utils'
import { viewport } from './viewport'

/* 渲染完整内容所需的参数 */
const full = reactive({
  fov: computed(() => {
    const { fov, phone } = variable
    const { h, isMobileInCSS, orientation } = viewport

    if (isMobileInCSS) {
      return fov.mobile[orientation]
    } else {
      return equivalentFov(fov.base, phone.w, h)
    }
  }),
  w: computed(() => viewport.w),
  h: computed(() => viewport.h),
})

/* 渲染相机中画面所需参数 */
const camera = reactive({
  fov: computed(() => {
    const { isMobileInCSS, orientation } = viewport
    const { fov, h: baseH } = full
    let { w, h } = variable.phone

    if (isMobileInCSS) {
      return fov
    } else {
      if (orientation !== 'portrait') [w, h] = [h, w]
      return equivalentFov(fov, baseH, h)
    }
  }),
  w: computed(() => {
    const { isMobileInCSS, orientation } = viewport
    const { phone } = variable
    const { w } = full
    if (isMobileInCSS) {
      return w
    } else {
      return orientation === 'portrait' ? phone.w : phone.h
    }
  }),
  h: computed(() => {
    const { isMobileInCSS, orientation } = viewport
    const { phone } = variable
    const { h } = full
    if (isMobileInCSS) {
      return h
    } else {
      return orientation === 'portrait' ? phone.h : phone.w
    }
  }),
  offsetX: 0,
  offsetY: 0,
})

/* 渲染照片所需参数 */
const photo = computed(() => {
  const imageQuality = variable.album.imageQuality
  const aspect = camera.w / camera.h

  // 输出尺寸
  const outputW = (Math.sqrt(imageQuality * aspect) >> 1) << 1
  const outputH = ((outputW / aspect) >> 1) << 1

  const ratio = outputW / camera.w

  // 偏移量
  const offsetX = 0 * ratio
  const offsetY = 0 * ratio

  // 渲染时尺寸、视野范围
  const w = outputW + Math.abs(offsetX)
  const h = outputH + Math.abs(offsetY)
  const fov = equivalentFov(camera.fov, outputH, h)

  return { outputW, outputH, offsetX, offsetY, w, h, fov }
})

const state = reactive({
  full,
  camera,
  photo,
})

export const view = readonly(state)
