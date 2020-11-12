import { defineComponent } from 'vue'
import { camera, toggleCameraVisible, toggleCameraDelay } from '../../store'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCameraToolBar',
  setup() {
    return () => (
      <div class={styles.toolbar}>
        <div
          class={styles.toolbar__button}
          data-active={camera.visible.constellation}
          onClick={() => toggleCameraVisible('constellation')}
        >
          星座
        </div>

        <div
          class={styles.toolbar__button}
          data-active={!!camera.delay}
          onClick={toggleCameraDelay}
        >
          延时{camera.delay ? camera.delay / 1000 : ''}
        </div>
      </div>
    )
  },
})
