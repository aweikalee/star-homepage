import { computed, defineComponent, onUnmounted, ref, watch } from 'vue'
import { Renderer, Camera, RenderTarget, Post } from 'ogl-typescript'
import { album, camera as cameraStore, glstate, viewport } from '../../store'
import { useRaf } from '../../utils'
import { createScene } from './scene/createScene'
import { createScene as createSceneView } from './sceneView/createScene'
import { createPost } from './post/createPost'
import styles from './styles.module.scss'

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
      return createSceneView(gl.value)
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

    const post = computed(() => {
      if (!gl.value) return
      return createPost(gl.value)
    })

    /* 进行拍照时 采用的 Post */
    const postView = computed(() => {
      if (!gl.value) return
      return createPost(gl.value)
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

    /* Post */
    watch(
      () => ({
        post: post.value,
        w: viewport.w,
        h: viewport.h,
      }),
      ({ post, w, h }) => {
        post?.resize({
          width: w,
          height: h,
        })
      }
    )
    watch(
      () => ({
        post: postView.value,
        w: album.view.w,
        h: album.view.h,
      }),
      ({ post, w, h }) => {
        post?.resize({
          width: w,
          height: h,
        })
      }
    )
    watch(
      () => ({
        post: post.value,
        postView: postView.value,
        balance: cameraStore.balance,
        desaturate: cameraStore.desaturate,
      }),
      ({ post, postView, balance, desaturate }) => {
        const setPass = (post?: Post) => {
          if (!post) return
          const [passBalance, passDesaturate] = post.passes
          passBalance.uniforms.uBalance.value = balance
          passDesaturate.enabled = desaturate
        }
        setPass(post)
        setPass(postView)
      }
    )

    /* 动画 */
    useRaf(() => {
      const _gl = gl.value
      const _renderer = renderer.value
      const _scene = scene.value
      const _sceneView = sceneView.value
      const _camera = camera.value
      const _post = post.value

      if (!_gl || !_renderer || !_camera || !_post) return

      _camera.rotation.copy(glstate.camera.rotation)

      _gl.disable(_gl.SCISSOR_TEST)
      if (cameraStore.frontCamera) {
        _camera.rotation.y += Math.PI
        _camera.rotation.x *= -1
      }
      _renderer.render({
        camera: camera.value,
        scene: scene.value,
      })
      if (cameraStore.frontCamera) {
        _camera.rotation.y -= Math.PI
        _camera.rotation.x *= -1
      }

      _gl.enable(_gl.SCISSOR_TEST)

      _post.render({
        camera: _camera,
        scene: _scene,
      })

      if (cameraStore.visible.constellation) {
        _renderer.render({
          camera: _camera,
          scene: _sceneView,
          clear: false,
        })
      }
    })

    /* 设置 takePhoto */
    album.setTakePhoto(() => {
      const _gl = gl.value
      const _renderer = renderer.value
      const _scene = scene.value
      const _sceneView = sceneView.value
      const _camera = camera.value
      const _cameraView = cameraView.value
      const _postView = postView.value

      if (!_gl || !_renderer || !_camera || !_cameraView || !_postView) return

      _cameraView.rotation.copy(_camera.rotation)

      const { w, h } = album.view

      const target = new RenderTarget(_gl, {
        width: w,
        height: h,
      })

      _gl.disable(_gl.SCISSOR_TEST)

      _postView.render({
        camera: _cameraView,
        scene: _scene,
        target,
      })

      if (cameraStore.visible.constellation) {
        _renderer.render({
          camera: _cameraView,
          scene: _sceneView,
          target,
          clear: false,
        })
      }

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
