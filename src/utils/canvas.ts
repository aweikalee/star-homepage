export function createCanvasFromImageData(data: ImageData) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!
  canvas.width = data.width
  canvas.height = data.height
  ctx.putImageData(data, 0, 0)
  return canvas
}

export function createThumbnailCanvas(
  imageCanvas: HTMLImageElement | HTMLCanvasElement,
  size: number
) {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  let dw = imageCanvas.width
  let dh = imageCanvas.height

  if ((size / dw) * dh >= size) {
    // 以 w 为准进行缩放裁剪
    dh = Math.round((size / dw) * dh)
    dw = size
  } else {
    // 以 h 为准进行缩放裁剪
    dw = Math.round((size / dh) * dw)
    dh = size
  }

  canvas.width = dw
  canvas.height = dh

  ctx.drawImage(imageCanvas, 0, 0, dw, dh)

  return canvas
}

export function toBlobPromise(
  canvas: HTMLCanvasElement,
  type?: string,
  quality?: any
) {
  return new Promise((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}
