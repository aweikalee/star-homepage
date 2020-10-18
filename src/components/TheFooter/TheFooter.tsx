import { defineComponent } from 'vue'
import { beian } from '../../config'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheFooter',
  setup() {
    return () => (
      <div class={styles.footer}>
        <div>
          DESIGN BY <a href="https://github.com/aweikalee">@AWEIKALEE (毛呆)</a>
        </div>

        <div>
          <a href={beian.url}>{beian.text}</a>
        </div>
      </div>
    )
  },
})
