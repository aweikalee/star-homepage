import { computed, reactive, readonly } from 'vue'
import { variable } from '../config'
import { glstate } from './glstate'

export type ITakePhoto = () => HTMLCanvasElement | void
export type IPhoto = {
  src: string
  w: number
  h: number
}

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
