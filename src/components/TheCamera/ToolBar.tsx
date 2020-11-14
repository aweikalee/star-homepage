import { defineComponent } from 'vue'
import { camera, toggleCameraVisible, toggleCameraDelay } from '../../store'
import { preventOrbit } from '../../webgl/utils'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCameraToolBar',
  setup() {
    return () => (
      <div class={styles.toolbar}>
        <div
          class={styles.toolbar__button}
          data-active={camera.visible.constellation}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            toggleCameraVisible('constellation')
          }}
        >
          星座
        </div>

        <div
          class={styles.toolbar__button}
          data-active={!!camera.delay}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            toggleCameraDelay()
          }}
        >
          延时{camera.delay ? camera.delay / 1000 : ''}
        </div>

        <div
          class={styles.toolbar__button}
          data-active={!!camera.delay}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            toggleCameraVisible('balance')
          }}
        >
          色彩平衡
        </div>
      </div>
    )
  },
})
