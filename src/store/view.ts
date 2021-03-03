import { computed, reactive, readonly, ref, watch } from 'vue'
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
  fov: 1,
  w: 1,
  h: 1,
  offsetX: 0,
  offsetY: 0,
})

// camera 参数将根据该 DOM 进行计算
const cameraElement = ref<HTMLElement | null>(null)
function setCameraElement(el: HTMLElement | null) {
  cameraElement.value = el
}

watch(
  () => ({
    el: cameraElement.value,
    ...full,
  }),
  ({ el, fov, w, h }) => {
    if (!el) return

    const rect = el.getBoundingClientRect()
    camera.w = Math.floor(rect.width)
    camera.h = Math.floor(rect.height)
    camera.offsetX = Math.floor(rect.x + rect.width / 2 - w / 2)
    camera.offsetY = Math.floor(rect.y + rect.height / 2 - h / 2)
    camera.fov = equivalentFov(fov, h, camera.h)
  }
)

/* 渲染照片所需参数 */
const photo = computed(() => {
  const imageQuality = variable.album.imageQuality
  const aspect = camera.w / camera.h

  // 输出尺寸
  const outputW = (Math.sqrt(imageQuality * aspect) >> 1) << 1
  const outputH = ((outputW / aspect) >> 1) << 1

  const ratio = outputW / camera.w

  // 偏移量
  const offsetX = Math.floor(camera.offsetX * ratio)
  const offsetY = Math.floor(camera.offsetY * ratio)

  // 渲染时尺寸、视野范围
  const w = outputW + Math.abs(offsetX) * 2
  const h = outputH + Math.abs(offsetY) * 2
  const fov = equivalentFov(camera.fov, outputH, h)

  return { outputW, outputH, offsetX, offsetY, w, h, fov }
})

const state = reactive({
  full,
  camera,
  photo,

  setCameraElement,
})

export const view = readonly(state)
