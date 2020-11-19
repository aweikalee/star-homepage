import { computed, CSSProperties, defineComponent } from 'vue'
import { Vec3, Mat4 } from 'ogl-typescript'
import { constellation, glstate } from '../../store'
import { variable } from '../../config'

import styles from './styles.module.scss'
import { preventOrbit } from '../../webgl/utils'

const { near, far } = variable.constellation

export default defineComponent({
  name: 'TheFoucs',
  props: {
    onClick: {
      type: Function,
    },
  },
  setup(props) {
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

    let isMoved = false
    const onMousemove = () => {
      isMoved = true
    }
    const onMousedown = () => {
      isMoved = false
      addEventListener('mousemove', onMousemove, {
        once: true,
      })
    }
    const onMouseup = () => {
      removeEventListener('mousemove', onMousemove)
    }

    return () => {
      const focus = constellation.focus
      if (!focus) return null

      return (
        <div
          class={styles.focus}
          title={focus.title}
          style={style.value}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            if (!isMoved) props.onClick?.()
          }}
          onMousedown={onMousedown}
          onMouseup={onMouseup}
        >
          <span></span>
          <span></span>
          <span></span>
          <span></span>
        </div>
      )
    }
  },
})
