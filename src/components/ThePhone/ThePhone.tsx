import { defineComponent } from 'vue'
import TheFooter from '../TheFooter'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'ThePhone',
  setup(props, { slots }) {
    return () => (
      <div class={styles.phone}>
        {slots.default?.()}

        <TheFooter class={styles.footer} />
        <div class={styles['border-top']}></div>
        <div class={styles['border-bottom']}></div>
        <div class={styles['border-left']}></div>
        <div class={styles['border-right']}></div>
      </div>
    )
  },
})
