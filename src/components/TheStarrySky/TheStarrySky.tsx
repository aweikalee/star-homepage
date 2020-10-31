import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  Renderer,
  Transform,
  Camera,
  OGLRenderingContext,
  RenderTarget,
} from 'ogl-typescript'
import { album, glstate, viewport } from '../../store'
import { useRaf, createBMP } from '../../utils'
import { createScene } from './scene/createScene'
import { createScene as createSceneView } from './sceneView/createScene'

import styles from './styles.module.scss'
import { variable } from '../../config'

export default defineComponent({
  name: 'TheStarrySky',
  setup() {
    const el = ref<HTMLCanvasElement>()

    let renderer: Renderer | undefined
    let gl: OGLRenderingContext | undefined
    let scene: Transform | undefined
    let sceneView: Transform | undefined
    let camera: Camera | undefined
    let cameraView: Camera | undefined
    let stop = false

    /* 重置尺寸 */
    const onResize = () => {
      const { w, h } = viewport
      const view = glstate.view

      renderer?.setSize(w, h)

      camera?.perspective({
        fov: (glstate.fov * 180) / Math.PI,
        aspect: w / h,
      })
      cameraView?.perspective({
        fov: (view.fov * 180) / Math.PI,
        aspect: view.w / view.h,
      })

      gl?.scissor((w - view.w) / 2, (h - view.h) / 2, view.w, view.h)
    }
    watch(viewport, onResize)

    /* 初始化 */
    const initCanvas = () => {
      const canvas = el.value!

      renderer = new Renderer({ canvas, preserveDrawingBuffer: true })
      gl = renderer.gl
      gl.clearColor(0, 0, 0, 1)

      camera = new Camera(gl)
      cameraView = new Camera(gl)

      scene = createScene(gl)
      sceneView = createSceneView(gl)

      onResize()

      album.setTakePhoto(() => {
        cameraView!.rotation.copy(camera!.rotation)

        const view = glstate.view
        const imageQuality = variable.album.imageQuality
        const aspect = view.w / view.h

        const w = (Math.sqrt(imageQuality * aspect) >> 1) << 1
        const h = ((w / aspect) >> 1) << 1

        const target = new RenderTarget(gl!, {
          width: w,
          height: h,
        })

        gl!.disable(gl!.SCISSOR_TEST)

        renderer!.render({
          camera: cameraView,
          scene,
          target,
        })

        renderer!.render({
          camera: cameraView,
          scene: sceneView,
          target,
          clear: false,
        })

        const pixels = new Uint8Array(w * h * 4)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target!.buffer)
        gl!.readPixels(0, 0, w, h, gl!.RGBA, gl!.UNSIGNED_BYTE, pixels)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)

        const blob = createBMP({
          data: removeAlpha(pixels),
          width: w,
          height: h,
        })

        return blob
      })
    }
    onMounted(initCanvas)

    /* 动画 */
    useRaf(() => {
      if (!camera || !renderer || !gl) return
      if (stop) return

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

function removeAlpha(data: Uint8Array) {
  const size = Math.floor(data.length / 4)
  const res = new Uint8Array(size * 3)
  let step3 = 0
  let step4 = 0
  for (let i = 0; i < size; i += 1) {
    res[step3] = data[step4]
    res[step3 + 1] = data[step4 + 1]
    res[step3 + 2] = data[step4 + 2]

    step3 += 3
    step4 += 4
  }
  return res
}
