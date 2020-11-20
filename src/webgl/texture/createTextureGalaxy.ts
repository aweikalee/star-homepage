import { Color, OGLRenderingContext, Texture } from 'ogl-typescript'
import { createCanvasFromImageData } from '../../utils'
import { createChromaScale, random, randomGaussian } from '../utils'
import { EasyDraw } from './easydraw'

export async function createCanvasGalaxy() {
  const h = 2048
  const w = h * 2

  const ed = new EasyDraw({
    width: w,
    height: h,
  })

  /* 底色 */
  // 黑色
  ed.rect({ w, h }, { fill: '#000' })
  // 蓝色、紫色
  ed.wrapper(
    () => {
      ;[0xa154cd, 0x0066a4].forEach((color) => {
        drawGalaxy(ed, {
          image: createSmoke(new Color(color)),
          width: w,
          height: h,

          quantity: 20,
          x: () => Math.random(),
          y: () => Math.random(),
          scale: () => random(0.5, 1) * 100,
          fy: () => 1,
        })
      })
    },
    { opacity: 0.1 }
  )
  // 绿色
  ed.wrapper(
    () => {
      drawGalaxy(ed, {
        image: createSmoke(new Color(0x27b872)),
        width: w,
        height: h * 0.3,

        quantity: 20,
        x: () => randomGaussian(2),
        y: () => Math.random(),
        scale: () => random(0.5, 1) * 50,
      })
    },
    { opacity: 0.15 }
  )

  /* 银河带 */
  // 黄色
  ed.wrapper(
    () => {
      drawGalaxy(ed, {
        image: createSmoke(new Color(0xf7ecd2)),
        width: w * 0.9,
        height: 100,

        quantity: 200,
        x: () => randomGaussian(2),
        y: () => Math.random(),
        scale: () => random(0.2, 1) * 15,
      })
    },
    { opacity: 0.3 }
  )
  ed.wrapper(
    () => {
      drawGalaxy(ed, {
        image: createSmoke(new Color(0xf7ecd2)),
        width: w * 0.3,
        height: 200,

        quantity: 100,
        x: () => randomGaussian(2),
        y: () => Math.random(),
        scale: () => random(0.2, 1) * 15,
      })
    },
    { opacity: 0.3 }
  )

  // 白色
  ed.wrapper(
    () => {
      drawGalaxy(ed, {
        image: createSmoke(new Color(0xffffff)),
        width: w * 0.9,
        height: 70,

        quantity: 300,
        x: () => randomGaussian(3),
        y: () => Math.random() - 0.5,
        scale: () => random(0.1, 1) * 6,
      })
    },
    { opacity: 0.2 }
  )
  ed.wrapper(
    () => {
      drawGalaxy(ed, {
        image: createSmoke(new Color(0xffffff)),
        width: w * 0.3,
        height: 200,

        quantity: 100,
        x: () => randomGaussian(3),
        y: () => Math.random() - 0.5,
        scale: () => random(0.1, 1) * 10,
      })
    },
    { opacity: 0.15 }
  )

  /* 暗星云 */
  ed.wrapper(
    () => {
      const dusts: [Color, number, number][] = [
        [new Color(0x1c1105), 1, 0.3],
        [new Color(0x1c1105), 1, 1.36],
        [new Color(0x1c1105), 0.4, 1.1],
        [new Color(0x1c1105), 2.9, 1.1],
      ]
      dusts.forEach((v) => {
        drawGalaxy(ed, {
          image: createDust(...v),
          width: w,
          height: 50,

          quantity: 300,
          x: () => random(0.05, 0.95),
          y: () => randomGaussian(2),
          scale: () => random(0.1, 1) * 1.5,
        })
      })

      drawGalaxy(ed, {
        image: createDust(...dusts[3]),
        width: w * 0.5,
        height: 200,

        quantity: 2000,
        x: () => randomGaussian(3),
        y: () => randomGaussian(2),
        scale: () => random(0.1, 1) * 1.5,
      })
    },
    { opacity: 0.1 }
  )

  /* 边缘处理成黑色，弱化拼接痕迹 */
  ed.wrapper(
    () => {
      const smoke = createSmoke(new Color(0))
      const smokeSize = smoke.width
      const step = 0.3
      const baseScale = 40

      let sum = 0
      const scales = []
      while (sum <= h) {
        const scale = Math.random() * baseScale
        scales.push(scale)
        sum += scale * smokeSize * step
      }

      const cw = w / 2
      const ch = h / 2
      let y = -ch

      scales.forEach((scale) => {
        ed.drawImage(smoke, {
          x: -cw,
          y,
          rotate: scale,
          scaleX: scale,
          scaleY: scale,
        })
        ed.drawImage(smoke, {
          x: cw,
          y,
          rotate: scale,
          scaleX: scale,
          scaleY: scale,
        })

        y += scale * smokeSize * step
      })
    },
    { opacity: 1 }
  )

  /* 星星 */
  drawStar()
  function drawStar() {
    const colorLen = 20
    const colors: string[] = []
    const chroma = createChromaScale(0xff8080, 0x8080ff)

    for (let i = 0; i < colorLen; i += 1) {
      const color = `rgb(${chroma(i / (colorLen - 1))
        .map((v) => v * 255)
        .join(',')})`
      colors.push(color)
    }

    draw(10000, 1)
    draw(1000, 2)
    draw(1000, 3)

    function draw(quantity: number, size: number) {
      for (let i = 0; i < quantity; i += 1) {
        ed.circle(
          { radius: size / 2 },
          {
            fill: colors[i % colorLen],
            x: (Math.random() - 0.5) * w,
            y: (Math.random() - 0.5) * h,
          }
        )
      }
    }
  }

  return ed.canvas
}

let texture: Texture
export function createTextureGalaxy(gl: OGLRenderingContext) {
  if (!texture) {
    texture = new Texture(gl)
    createCanvasGalaxy().then((canvas) => {
      texture.image = canvas as any
    })
  }
  return texture
}

// prettier-ignore
const OPACITIES = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 5, 5, 7, 4, 4, 1, 1, 0, 1, 0, 0, 0, 0, 0, 1, 0, 0, 17, 27, 41, 52, 56, 34, 23, 15, 11, 4, 9, 5, 1, 0, 0, 0, 0, 0, 0, 1, 45, 63, 57, 45, 78, 66, 52, 41, 34, 37, 23, 20, 0, 1, 0, 0, 0, 0, 1, 43, 62, 66, 64, 67, 115, 112, 114, 56, 58, 47, 33, 18, 12, 10, 0, 0, 0, 0, 39, 50, 63, 76, 87, 107, 105, 112, 128, 104, 69, 64, 29, 18, 21, 15, 0, 0, 0, 7, 42, 52, 85, 91, 103, 126, 153, 128, 124, 82, 57, 52, 52, 24, 1, 0, 0, 0, 2, 17, 41, 67, 84, 100, 122, 136, 159, 127, 78, 69, 60, 50, 47, 25, 7, 1, 0, 0, 0, 34, 33, 66, 82, 113, 138, 149, 168, 175, 82, 142, 133, 70, 62, 41, 25, 6, 0, 0, 0, 18, 39, 55, 113, 111, 137, 141, 139, 141, 128, 102, 130, 90, 96, 65, 37, 0, 0, 0, 2, 15, 27, 71, 104, 129, 129, 158, 140, 154, 146, 150, 131, 92, 100, 67, 26, 3, 0, 0, 0, 0, 46, 73, 104, 124, 145, 135, 122, 107, 120, 122, 101, 98, 96, 35, 38, 7, 2, 0, 0, 0, 50, 58, 91, 124, 127, 139, 118, 121, 177, 156, 88, 90, 88, 28, 43, 3, 0, 0, 0, 0, 30, 62, 68, 91, 83, 117, 89, 139, 139, 99, 105, 77, 32, 1, 1, 0, 0, 0, 0, 0, 16, 21, 8, 45, 101, 125, 118, 87, 110, 86, 64, 39, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 28, 79, 79, 117, 122, 88, 84, 54, 46, 11, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 6, 55, 61, 68, 71, 30, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 14, 23, 25, 20, 12, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 2, 12, 9, 8, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4, 2, 2, 0, 0, 0, 0, 0, 0, 0, 0]

function createSmoke(color: Color | number[]) {
  const size = 20
  const [r, g, b] = color.map((v) => v * 255)
  const len = size * size
  const data = new Uint8ClampedArray(len * 4)
  for (let i = 0; i < len; i += 1) {
    const index = i * 4
    data[index] = r
    data[index + 1] = g
    data[index + 2] = b
    data[index + 3] = OPACITIES[i]
  }
  const imageData = new ImageData(data, size, size)
  return createCanvasFromImageData(imageData)
}

export function createDust(color: Color | number[], rx: number, ry: number) {
  const w = 50
  const opacity = 0.3

  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  const cx = w / 2
  const cy = w / 2

  canvas.width = w
  canvas.height = w

  ctx.fillStyle = `rgb(${color.map((v) => v * 255).join(',')}, ${opacity})`

  const len = 300
  const TAU = Math.PI * 2
  for (let i = 0; i < len; i += 1) {
    const r = Math.random()

    var x = Math.cos(((TAU * rx) / len) * i) * r * cx
    var y = Math.sin(((TAU * ry) / len) * i) * r * cy

    ctx.beginPath()
    ctx.arc(x + cx, y + cy, 3, 0, TAU)
    ctx.fill()
  }

  return canvas
}

function drawGalaxy(
  ed: EasyDraw,
  options: {
    image: CanvasImageSource
    width: number
    height: number

    quantity: number
    x: () => number
    y: () => number
    scale: () => number
    fy?: (x: number, index: number) => number
  }
) {
  const pi = Math.PI
  const {
    image,
    width,
    height,

    quantity,
    x,
    y,
    scale,
    fy = (x) => Math.sin(x * pi),
  } = options

  for (let i = 0; i < quantity; i += 1) {
    const xValue = x()
    const yValue = y()
    const scaleValue = scale()

    ed.drawImage(image, {
      x: (xValue - 0.5) * width,
      y: (yValue - 0.5) * fy(xValue, i) * height,
      rotate: Math.random() * pi,
      scaleX: scaleValue,
      scaleY: scaleValue,
    })
  }
}
