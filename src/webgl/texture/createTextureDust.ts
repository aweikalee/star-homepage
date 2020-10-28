import { OGLRenderingContext, Texture } from 'ogl-typescript'

export function createCanvasDust() {
  const w = 100
  const opacity = 0.15

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const cx = w / 2
  const cy = w / 2

  canvas.width = w
  canvas.height = w

  const xRand = -1.5
  const yRand = -0.9
  const xRand2 = 32
  const yRand2 = 26

  ctx.fillStyle = `rgba(255, 255, 255, ${opacity})`

  const len = 200
  const TAU = Math.PI * 2
  for (let i = 0; i < len; i += 1) {
    const p = Math.random()

    var x = Math.cos((TAU / xRand / len) * i) * p * xRand2 + cx
    var y = Math.sin((TAU / yRand / len) * i) * p * yRand2 + cy

    ctx.beginPath()
    ctx.moveTo(x, y)
    ctx.arc(x, y, p * 4, 0, TAU)
    ctx.fill()
  }

  return canvas
}

export function createTextureDust(gl: OGLRenderingContext) {
  const canvas = createCanvasDust()
  return new Texture(gl, {
    image: canvas as any,
  })
}
