import { computed, defineComponent, onUnmounted, ref, watch } from 'vue'
import { Renderer, Camera, RenderTarget } from 'ogl-typescript'
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

    const renderer = computed(() => {
      if (!el.value) return
      return new Renderer({
        canvas: el.value,
        preserveDrawingBuffer: true,
        antialias: true,
      })
    })

    const gl = computed(() => {
      if (!renderer.value) return
      const gl = renderer.value.gl
      gl.clearColor(0, 0, 0, 1)
      return gl
    })

    const scene = computed(() => {
      if (!gl.value) return
      return createScene(gl.value)
    })

    /* 仅视口区域内存在的内容 */
    const sceneView = computed(() => {
      if (!gl.value || !scene.value) return
      const sceneView = createSceneView(gl.value)
      scene.value.setParent(sceneView)
      return sceneView
    })

    const camera = computed(() => {
      if (!gl.value) return
      return new Camera(gl.value)
    })

    /* 进行拍照时 采用的 Camera */
    const cameraView = computed(() => {
      if (!gl.value) return
      const camera = new Camera(gl.value)
      camera.scale.y = -1 // 平面 与 webgl 坐标 y 轴相反
      return camera
    })

    /* Renderer */
    watch(
      () => ({
        renderer: renderer.value,
        w: viewport.w,
        h: viewport.h,
      }),
      ({ renderer, w, h }) => {
        renderer?.setSize(w, h)
      }
    )
    watch(
      () => ({
        gl: gl.value,
        x: (viewport.w - glstate.view.w) / 2,
        y: (viewport.h - glstate.view.h) / 2,
        w: glstate.view.w,
        h: glstate.view.h,
      }),
      ({ gl, x, y, w, h }) => {
        gl?.scissor(x, y, w, h)
      }
    )

    /* Camera */
    watch(
      () => ({
        camera: camera.value,
        aspect: viewport.w / viewport.h,
        fov: (glstate.fov * 180) / Math.PI,
      }),
      ({ camera, aspect, fov }) => {
        camera?.perspective({ fov, aspect })
      }
    )
    watch(
      () => ({
        camera: cameraView.value,
        aspect: glstate.view.w / glstate.view.h,
        fov: (glstate.view.fov * 180) / Math.PI,
      }),
      ({ camera, aspect, fov }) => {
        camera?.perspective({ fov, aspect })
      }
    )

    /* 动画 */
    useRaf(() => {
      const _gl = gl.value
      const _renderer = renderer.value
      const _scene = scene.value
      const _sceneView = sceneView.value
      const _camera = camera.value

      if (!_gl || !_renderer || !_camera) return

      _camera.rotation.copy(glstate.camera.rotation)

      _gl.disable(_gl.SCISSOR_TEST)
      _renderer.render({
        camera: camera.value,
        scene: scene.value,
      })

      _gl.enable(_gl.SCISSOR_TEST)
      _renderer.render({
        camera: camera.value,
        scene: cameraStore.constellation ? _sceneView : _scene,
      })
    })

    /* 设置 takePhoto */
    album.setTakePhoto(() => {
      const _gl = gl.value
      const _renderer = renderer.value
      const _scene = scene.value
      const _sceneView = sceneView.value
      const _camera = camera.value
      const _cameraView = cameraView.value

      if (!_gl || !_renderer || !_camera || !_cameraView) return

      _cameraView.rotation.copy(_camera.rotation)

      const view = glstate.view
      const imageQuality = variable.album.imageQuality
      const aspect = view.w / view.h

      const w = (Math.sqrt(imageQuality * aspect) >> 1) << 1
      const h = ((w / aspect) >> 1) << 1

      const target = new RenderTarget(_gl, {
        width: w,
        height: h,
      })

      _gl.disable(_gl.SCISSOR_TEST)

      _renderer.render({
        camera: _cameraView,
        scene: cameraStore.constellation ? _sceneView : _scene,
        target,
      })

      const pixels = new Uint8Array(w * h * 4)
      // readPixels 的 dstData 中直接使用 Uint8ClampedArray，在 safari 中无法获得数据
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, target.buffer)
      _gl.readPixels(0, 0, w, h, _gl.RGBA, _gl.UNSIGNED_BYTE, pixels)
      _gl.bindFramebuffer(_gl.FRAMEBUFFER, null)

      return new ImageData(new Uint8ClampedArray(pixels), w, h)
    })
    onUnmounted(() => album.setTakePhoto(() => {}))

    return () => <canvas class={styles.starry} ref={el}></canvas>
  },
})
