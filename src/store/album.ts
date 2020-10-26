import { reactive, readonly } from 'vue'
import { glstate } from './glstate'
import { viewport } from './viewport'

export type ITakePhoto = () => string

const state = reactive({
  data: [] as string[],
  canvas: null as HTMLCanvasElement | null,
  toDataUrl(...args: Parameters<HTMLCanvasElement['toDataURL']>) {
    return draw().toDataURL(...args)
  },
  toBlob(...args: Parameters<HTMLCanvasElement['toDataURL']>) {
    return new Promise<Blob | null>((resolve) => {
      draw().toBlob((blob) => {
        resolve(blob)
      }, ...args)
    })
  },
})

export const album = readonly(state)

export function pushPhoto(value: string) {
  state.data.push(value)
}

export function setCanvas(value: HTMLCanvasElement) {
  state.canvas = value
}

const canvas = document.createElement('canvas')
const ctx = canvas.getContext('2d')!
function draw() {
  if (!state.canvas) throw new Error('cannot find canvas')

  const { w, h } = viewport
  const {
    view: { w: viewW, h: viewH },
  } = glstate

  canvas.width = viewW
  canvas.height = viewH

  ctx.clearRect(0, 0, viewW, viewH)
  ctx.drawImage(state.canvas, (viewW - w) / 2, (viewH - h) / 2)

  return canvas
}
