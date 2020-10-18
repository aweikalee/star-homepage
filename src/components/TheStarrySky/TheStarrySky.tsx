import { computed, defineComponent, onMounted, ref, watch } from 'vue'
import {
  Renderer,
  Transform,
  Camera,
  Orbit,
  OrbitOptions,
} from 'ogl-typescript'
import { viewport } from '../../store'
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
    let controls: any

    /* 视角 */
    const fov = computed(() => {
      const h = viewport.h
      const scale = Math.max(h / 450, 1)
      const alpha = (30 * Math.PI) / 180
      const tanAlpha = Math.tan(alpha / 2)
      const beta = 2 * Math.atan(scale * tanAlpha)
      const fov = (beta * 180) / Math.PI

      return fov
    })

    /* 重置尺寸 */
    const onResize = () => {
      const { w, h } = viewport
      renderer?.setSize(w, h)
      camera?.perspective({
        fov: fov.value,
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
      camera.position.set(0, 0, 0.00001)
      camera.lookAt([0, 0, 0])
      controls = new (Orbit as any)(camera, {
        ease: 0.5, // 缓动
        enableZoom: false, // 允许缩放
        enablePan: false, // 允许平移
        rotateSpeed: -0.03, // 旋转速度
        autoRotate: true, // 自动转动
        autoRotateSpeed: 0.06, // 自动转动速度
        minPolarAngle: Math.PI / 2 - Math.PI / 16, // 最小纵向视角
        maxPolarAngle: Math.PI / 2 + Math.PI / 16, // 最大纵向视角
      } as OrbitOptions)

      scene = createScene(gl)

      onResize()
    }
    onMounted(initCanvas)

    /* 动画 */
    useRaf(() => {
      controls?.update()
      renderer?.render({
        scene,
        camera,
      })
    })

    return () => <canvas class={styles.starry} ref={el}></canvas>
  },
})
