import { computed, CSSProperties, defineComponent } from 'vue'
import { Vec3, Mat4 } from 'ogl-typescript'
import { constellation, glstate } from '../../store'
import { variable } from '../../config'

import styles from './styles.module.scss'
import { preventOrbit } from '../../webgl/utils'

const { near, far } = variable.constellation

export default defineComponent({
  name: 'TheFoucs',
  setup() {
    const size = computed(() => {
      const base = 200 * variable.constellation.scale
      const { x } = glstate.toPx(base, 0, near)
      return x
    })

    const style = computed<CSSProperties | undefined>(() => {
      const focus = constellation.focus
      if (!focus) return

      const rotation = glstate.camera.rotation
      const { x, y, z } = new Vec3(0, 0, -far).applyMatrix4(
        new Mat4()
          .rotate(focus.rotationX - rotation.x, [1, 0, 0])
          .rotate(focus.rotationY - rotation.y, [0, 1, 0])
      )

      const { x: resX, y: resY } = glstate.toPx(x, y, Math.abs(z))

      const s = size.value
      return {
        width: `${s}px`,
        height: `${s}px`,

        transform: `translate(${-s / 2 + resX}px, ${-s / 2 + resY}px)`,
      }
    })

    return () => {
      const focus = constellation.focus
      if (!focus) return null

      return (
        <>
          <a
            class={styles.focus}
            href={focus.url}
            title={focus.title}
            style={style.value}
            target="blank"
            {...preventOrbit}
          >
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </a>

          <div class={styles.info}>
            <a
              href={focus.url}
              title={focus.title}
              target="blank"
              {...preventOrbit}
            >
              {focus.title}
            </a>
          </div>
        </>
      )
    }
  },
})
