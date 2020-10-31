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
    mobile: {
      portrait: (50 / 360) * 2 * Math.PI,
      landscape: (30 / 360) * 2 * Math.PI,
    },
  },
  constellation: {
    scale: 0.008,
    near: 5,
    far: 6,
  },
  album: {
    imageQuality: 1000 * 600,
  },
}
