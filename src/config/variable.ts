import screen from '../style/screen.module.scss'
import phone from '../style/phone.module.scss'

export const variable = {
  screenBoundary: {
    w: Number(screen.screenBoundaryWidth),
    h: Number(screen.screenBoundaryHeight),
  },
  phone: {
    w: Number(phone.phoneWidth),
    h: Number(phone.phoneHeight),
  },
  fov: {
    base: (30 / 360) * 2 * Math.PI,
    mobile: (50 / 360) * 2 * Math.PI,
  },
  constellation: {
    scale: 0.01,
    near: 5,
    far: 6,
  },
}
