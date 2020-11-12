import { reactive, readonly } from 'vue'
import { createCanvasFromImageData } from '../utils'

export type ITakePhoto = () => HTMLCanvasElement | void

const state = reactive({
  /* photo */
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
