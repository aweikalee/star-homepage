export interface IEasyDrawOptions {
  canvas?: HTMLCanvasElement
  width?: number
  height?: number
}

export interface IEasyDrawState {
  x: number
  y: number
  rotate: number
  scaleX: number
  scaleY: number
  opacity: number
  fill: string | CanvasGradient | CanvasPattern
  stroke: string | CanvasGradient | CanvasPattern
  strokeWidth: number
}

export class EasyDraw {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  constructor(options: IEasyDrawOptions = {}) {
    const {
      canvas = document.createElement('canvas'),
      width = 100,
      height = 100,
    } = options

    this.canvas = canvas
    const ctx = (this.ctx = canvas.getContext('2d')!)

    canvas.width = width
    canvas.height = height

    ctx.translate(width / 2, height / 2)
  }

  save() {
    this.ctx.save()
    return this
  }

  restore() {
    this.ctx.restore()
    return this
  }

  setStyles(state: Partial<IEasyDrawState>) {
    const {
      x,
      y,
      rotate,
      scaleX,
      scaleY,
      opacity,
      fill,
      stroke,
      strokeWidth,
    } = state
    const { ctx } = this

    if (x !== undefined || y !== undefined) {
      ctx.translate(x ?? 0, y ?? 0)
    }

    if (rotate) {
      ctx.rotate(rotate)
    }

    if (scaleX !== undefined || scaleY !== undefined) {
      ctx.scale(scaleX ?? 1, scaleY ?? 1)
    }

    if (opacity !== undefined) {
      ctx.globalAlpha = opacity
    }

    if (fill !== undefined) {
      ctx.fillStyle = fill
    }

    if (stroke !== undefined) {
      ctx.strokeStyle = stroke
    }

    if (strokeWidth !== undefined) {
      ctx.lineWidth = strokeWidth
    }

    return this
  }

  wrapper(fn: Function, styles?: Partial<IEasyDrawState>) {
    if (styles) {
      this.save()
      this.setStyles(styles)
    }

    fn()

    if (styles) {
      this.restore()
    }

    return this
  }

  drawImage(image: CanvasImageSource, styles?: Partial<IEasyDrawState>) {
    return this.wrapper(() => {
      const { ctx } = this
      ctx.drawImage(image, -image.width / 2, -image.height / 2)
    }, styles)
  }

  rect({ w, h }: { w: number; h: number }, styles?: Partial<IEasyDrawState>) {
    return this.wrapper(() => {
      const { ctx } = this
      ctx.beginPath()
      ctx.rect(-w / 2, -h / 2, w, h)
      ctx.closePath()
      ctx.fill()
    }, styles)
  }

  circle({ radius }: { radius: number }, styles?: Partial<IEasyDrawState>) {
    return this.wrapper(() => {
      const { ctx } = this
      ctx.beginPath()
      ctx.arc(0, 0, radius, 0, 2 * Math.PI)
      ctx.closePath()
      ctx.fill()
    }, styles)
  }
}
