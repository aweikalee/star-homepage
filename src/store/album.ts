import { reactive, readonly } from 'vue'

export type ITakePhoto = () => HTMLCanvasElement | void
export type IPhoto = {
  src: string
  w: number
  h: number
}

const state = reactive({
  /* photo */
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
