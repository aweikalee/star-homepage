import { reactive, readonly } from 'vue'
import { createCanvasFromImageData } from '../utils'

export type ITakePhoto = () => HTMLCanvasElement

const state = reactive({
  data: [] as string[],
  takePhoto: (() => {}) as ITakePhoto,
  setTakePhoto(createImageData: () => ImageData) {
    state.takePhoto = () => {
      const data = createImageData()
      return createCanvasFromImageData(data)
    }
  },
})

export const album = readonly(state)

export function pushPhoto(value: string) {
  state.data.push(value)
}
