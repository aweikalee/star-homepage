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
  baseFov: (30 / 360) * 2 * Math.PI,
}
