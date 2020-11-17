import { defineComponent } from 'vue'
import { camera } from '../../store'
import { preventOrbit } from '../../webgl/utils'
import Icon from '../Icon'

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
            camera.toggleVisible('constellation')
          }}
        >
          <Icon value="constellation" />
        </div>

        <div
          class={styles.toolbar__button}
          data-active={!!camera.delay}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            camera.toggleDelay()
          }}
        >
          <Icon value="timer" />
          {camera.delay ? <span style={{fontSize: '0.5em'}}>{camera.delay / 1000}秒</span> : null}
        </div>

        <div
          class={styles.toolbar__button}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            camera.toggleVisible('balance')
          }}
        >
          <Icon value="balance" />
        </div>

        <div
          class={styles.toolbar__button}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            camera.toggleVisible('list')
          }}
        >
          <Icon value="list" />
        </div>
      </div>
    )
  },
})
