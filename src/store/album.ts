import { computed, reactive, readonly } from 'vue'
import { glstate } from './glstate'
import { viewport } from './viewport'

export type ITakePhoto = () => string

const temp = document.createElement('canvas')
const ctx = temp.getContext('2d')!
let canvas: HTMLCanvasElement | null = null
const toDataUrl = computed(() => {
  const { w, h } = viewport
  const {
    view: { w: viewW, h: viewH },
  } = glstate
  temp.width = viewW
  temp.height = viewH

  const [drawX, drawY] = [(viewW - w) / 2, (viewH - h) / 2]

  return () => {
    if (!canvas) throw new Error('cannot find canvas')
    ctx.clearRect(0, 0, viewW, viewH)
    ctx.drawImage(canvas, drawX, drawY)
    return temp.toDataURL()
  }
})

const state = reactive({
  data: [] as string[],
  toDataUrl,
  canvas: null as HTMLCanvasElement | null,
})

export const album = readonly(state)

export function setCanvas(value: HTMLCanvasElement) {
  state.canvas = value
  canvas = value
}

export function pushPhoto(value: string) {
  state.data.push(value)
}
