import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  Renderer,
  Transform,
  Camera,
  OGLRenderingContext,
} from 'ogl-typescript'
import { glstate, setCanvas, viewport } from '../../store'
import { useRaf } from '../../utils'
import { createScene } from './scene/createScene'
import { createScene as createSceneView } from './sceneView/createScene'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheStarrySky',
  setup() {
    const el = ref<HTMLCanvasElement>()

    let renderer: Renderer | undefined
    let gl: OGLRenderingContext | undefined
    let scene: Transform | undefined
    let sceneView: Transform | undefined
    let camera: Camera | undefined

    /* 重置尺寸 */
    const onResize = () => {
      const { w, h } = viewport
      const {
        view: { w: viewW, h: viewH },
      } = glstate

      renderer?.setSize(w, h)
      camera?.perspective({
        fov: (glstate.fov * 180) / Math.PI,
        aspect: w / h,
      })
      gl?.scissor((w - viewW) / 2, (h - viewH) / 2, viewW, viewH)
    }
    watch(viewport, onResize)

    /* 初始化 */
    const initCanvas = () => {
      const canvas = el.value!

      renderer = new Renderer({ canvas, preserveDrawingBuffer: true })
      gl = renderer.gl

      camera = new Camera(gl)

      scene = createScene(gl)
      sceneView = createSceneView(gl)

      onResize()
      setCanvas(canvas)
    }
    onMounted(initCanvas)

    /* 动画 */
    useRaf(() => {
      if (!camera || !renderer || !gl) return

      camera.rotation.copy(glstate.camera.rotation)

      gl.disable(gl.SCISSOR_TEST)
      renderer.render({
        scene,
        camera,
      })

      gl.enable(gl.SCISSOR_TEST)
      renderer.render({
        scene: sceneView,
        camera,
        clear: false,
      })
    })

    return () => <canvas class={styles.starry} ref={el}></canvas>
  },
})
