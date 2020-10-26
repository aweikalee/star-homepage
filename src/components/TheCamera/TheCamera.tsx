import { defineComponent } from 'vue'
import { album, pushPhoto } from '../../store'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCamera',
  setup(props, { slots }) {
    return () => (
      <div class={styles.camera}>
        <div class={styles.toolbar}>
          {['🐁', '🐂', '🐅', '🐇', '🐏'].map((v) => (
            <div class={styles.toolbar__button}>{v}</div>
          ))}
        </div>
        <div class={styles.view}>{slots.default?.()}</div>
        <div class={styles.shutterbar}>
          <div class={styles.album}>
            <div class={styles.album__button}></div>
          </div>
          <div class={styles.shutter}>
            <div
              class={styles.shutter__button}
              onClick={() => {
                const url = album.toDataUrl()
                pushPhoto(url)
              }}
            ></div>
          </div>
          <div class={styles.switch}>
            <div class={styles.switch__button}>📷</div>
          </div>
        </div>
      </div>
    )
  },
})
