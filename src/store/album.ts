import { computed, reactive, readonly } from 'vue'
import { variable } from '../config'
import { createCanvasFromImageData } from '../utils'
import { glstate } from './glstate'

export type ITakePhoto = () => HTMLCanvasElement | void

const view = computed(() => {
  const view = glstate.view
  const imageQuality = variable.album.imageQuality
  const aspect = view.w / view.h

  const w = (Math.sqrt(imageQuality * aspect) >> 1) << 1
  const h = ((w / aspect) >> 1) << 1

  return { w, h }
})

const state = reactive({
  /* photo */
  view,
  data: [] as string[],
  takePhoto: (() => {}) as ITakePhoto,
  setTakePhoto(createImageData: () => ImageData | void) {
    state.takePhoto = () => {
      const data = createImageData()
      if (!data) return
      return createCanvasFromImageData(data)
    }
  },

  /* TheAlbum */
  visible: false,
  buttonElement: null as HTMLElement | null,
})

export const album = readonly(state)

export function pushPhoto(value: string) {
  state.data.push(value)
}

export function setAlbumVisible(value: boolean) {
  state.visible = value
}

export function setAlbumButtonElement(el: HTMLElement | null) {
  state.buttonElement = el
}
