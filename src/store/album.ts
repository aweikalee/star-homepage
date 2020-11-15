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
  photos: [] as string[],
  pushPhoto(value: string) {
    state.photos.push(value)
  },
  takePhoto: (() => {}) as ITakePhoto,
  setTakePhoto(createImageData: () => ImageData | void) {
    state.takePhoto = () => {
      const data = createImageData()
      if (!data) return
      return createCanvasFromImageData(data)
    }
  },

  /* TheAlbum */
  buttonElement: null as HTMLElement | null,
  setButtonElement(el: HTMLElement | null) {
    state.buttonElement = el
  },
})

export const album = readonly(state)
