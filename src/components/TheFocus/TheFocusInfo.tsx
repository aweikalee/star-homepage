import { defineComponent } from 'vue'
import { constellation } from '../../store'

import styles from './styles.module.scss'
import { preventOrbit } from '../../webgl/utils'

export default defineComponent({
  name: 'TheFoucsInfo',
  setup() {
    return () => {
      const focus = constellation.focus
      if (!focus) return null

      return (
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
      )
    }
  },
})
