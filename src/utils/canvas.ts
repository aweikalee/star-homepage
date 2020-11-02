export function createCanvasFromImageData(data: ImageData) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = data.width
  canvas.height = data.height
  ctx.putImageData(data, 0, 0)
  return canvas
}
