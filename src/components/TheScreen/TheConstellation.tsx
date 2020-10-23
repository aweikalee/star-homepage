import { defineComponent, onMounted, ref, watch } from 'vue'
import { Renderer, Transform, Camera } from 'ogl-typescript'
import { glstate, viewport } from '../../store'
import { equivalentFov, useRaf } from '../../utils'
import { createScene } from './scene/createScene'

import styles from './styles.module.scss'
import { variable } from '../../config'

export default defineComponent({
  name: 'TheConstellation',
  setup() {
    const el = ref<HTMLCanvasElement>()

    let renderer: Renderer | undefined
    let scene: Transform | undefined
    let camera: Camera | undefined

    /* 重置尺寸 */
    const onResize = () => {
      const { w, h } = getViewport()
      const fov = getFov()

      renderer?.setSize(w, h)
      camera?.perspective({
        fov: (fov * 180) / Math.PI,
        aspect: w / h,
      })
    }
    watch(viewport, onResize)

    /* 初始化 */
    const initCanvas = () => {
      const canvas = el.value!

      renderer = new Renderer({ canvas, alpha: true })
      const { gl } = renderer

      camera = new Camera(gl)

      scene = createScene(gl)

      onResize()
    }
    onMounted(initCanvas)

    /* 动画 */
    useRaf(() => {
      const { x, y, z } = glstate.transform.position
      camera?.lookAt([x, -y, z])
      renderer?.render({
        scene,
        camera,
      })
    })

    return () => <canvas class={styles.constellation} ref={el}></canvas>
  },
})

function getViewport() {
  const { w, h, isMobileInCSS, orientation } = viewport
  const { phone } = variable

  if (isMobileInCSS) return { w, h }

  if (orientation === 'portrait') {
    return phone
  } else {
    return {
      w: phone.h,
      h: phone.w,
    }
  }
}

const equivalentBaseFov = equivalentFov(
  variable.fov.base,
  variable.phone.w,
  variable.phone.h
)
function getFov() {
  const { isMobileInCSS, orientation } = viewport
  const {
    fov: { base },
  } = variable

  if (isMobileInCSS) return glstate.fov

  if (orientation === 'portrait') {
    return equivalentBaseFov
  } else {
    return base
  }
}
