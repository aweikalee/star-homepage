import { reactive, readonly } from 'vue'
import { variable } from '../config'
import { createThumbnailCanvas, toBlobPromise } from '../utils'

export type ITakePhoto = () => HTMLCanvasElement | void
export type IPhoto = {
  src: string
  msrc: string
  w: number
  h: number
}

const state = reactive({
  /* photo */
  photos: [] as IPhoto[],
  async pushPhoto(value: Omit<IPhoto, 'msrc'>) {
    const msrc = await createThumbnail(value)
    state.photos.push({
      ...value,
      msrc,
    })
  },

  /* TheAlbum */
  buttonElement: null as HTMLElement | null,
  setButtonElement(el: HTMLElement | null) {
    state.buttonElement = el
  },
})

export const album = readonly(state)

function createThumbnail(photo: Omit<IPhoto, 'msrc'>) {
  const imagePromise = new Promise<HTMLImageElement>((resolve) => {
    const image = new Image()
    image.width = photo.w
    image.height = photo.h
    image.onload = () => resolve(image)
    image.src = photo.src
  })

  return new Promise<string>(async (resolve) => {
    const image = await imagePromise
    const canvas = createThumbnailCanvas(image, variable.album.thumbnailQuality)

    const blob = await toBlobPromise(canvas)
    const src = URL.createObjectURL(blob)

    resolve(src)
  })
}
