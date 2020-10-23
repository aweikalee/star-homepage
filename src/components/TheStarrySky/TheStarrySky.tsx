import { defineComponent, onMounted, ref, watch } from 'vue'
import { Renderer, Transform, Camera } from 'ogl-typescript'
import { glstate, viewport } from '../../store'
import { useRaf } from '../../utils'
import { createScene } from './scene/createScene'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheStarrySky',
  setup() {
    const el = ref<HTMLCanvasElement>()

    let renderer: Renderer | undefined
    let scene: Transform | undefined
    let camera: Camera | undefined

    /* 重置尺寸 */
    const onResize = () => {
      const { w, h } = viewport
      renderer?.setSize(w, h)
      camera?.perspective({
        fov: glstate.fov * 180 / Math.PI,
        aspect: w / h,
      })
    }
    watch(viewport, onResize)

    /* 初始化 */
    const initCanvas = () => {
      const canvas = el.value!

      renderer = new Renderer({ canvas })
      const { gl } = renderer

      camera = new Camera(gl)

      scene = createScene(gl)

      onResize()
    }
    onMounted(initCanvas)

    /* 动画 */
    useRaf(() => {
      const {x, y, z} = glstate.transform.position
      camera?.lookAt([x, -y, z])
      renderer?.render({
        scene,
        camera,
      })
    })

    return () => <canvas class={styles.starry} ref={el}></canvas>
  },
})
