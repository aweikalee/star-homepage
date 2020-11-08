import { defineComponent, onMounted, ref, watch } from 'vue'
import {
  Renderer,
  Transform,
  Camera,
  OGLRenderingContext,
  RenderTarget,
} from 'ogl-typescript'
import { album, camera as cameraStore, glstate, viewport } from '../../store'
import { useRaf } from '../../utils'
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

      renderer = new Renderer({
        canvas,
        preserveDrawingBuffer: true,
        antialias: true,
      })
      gl = renderer.gl
      gl.clearColor(0, 0, 0, 1)

      camera = new Camera(gl)
      cameraView = new Camera(gl)
      cameraView.scale.y = -1 // 平面 与 webgl 坐标 y 轴相反

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

        if (cameraStore.constellation) {
          renderer!.render({
            camera: cameraView,
            scene: sceneView,
            target,
            clear: false,
          })
        }

        const pixels = new Uint8Array(w * h * 4)
        // readPixels 的 dstData 中直接使用 Uint8ClampedArray，在 safari 中无法获得数据
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, target!.buffer)
        gl!.readPixels(0, 0, w, h, gl!.RGBA, gl!.UNSIGNED_BYTE, pixels)
        gl!.bindFramebuffer(gl!.FRAMEBUFFER, null)

        return new ImageData(new Uint8ClampedArray(pixels), w, h)
      })
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

      if (cameraStore.constellation) {
        gl.enable(gl.SCISSOR_TEST)
        renderer.render({
          scene: sceneView,
          camera,
          clear: false,
        })
      }
    })

    return () => <canvas class={styles.starry} ref={el}></canvas>
  },
})
