import { reactive, readonly } from 'vue'

export type ITakePhoto = () => Blob

const state = reactive({
  data: [] as string[],
  takePhoto: (() => {}) as ITakePhoto,
  setTakePhoto(render: ITakePhoto) {
    state.takePhoto = () => render()
  },
})

export const album = readonly(state)

export function pushPhoto(value: string) {
  state.data.push(value)
}
