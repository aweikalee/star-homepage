import { defineComponent } from 'vue'
import { camera, setCameraConstellation } from '../../store'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCameraToolBar',
  setup() {
    return () => (
      <div class={styles.toolbar}>
        <div
          class={styles.toolbar__button}
          data-active={camera.constellation}
          onClick={() => setCameraConstellation(!camera.constellation)}
        >
          星座
        </div>
      </div>
    )
  },
})
