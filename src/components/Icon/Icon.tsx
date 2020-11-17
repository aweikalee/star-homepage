import { defineComponent, PropType } from 'vue'
import iconMap from './iconMap'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'Icon',
  props: {
    value: {
      type: String as PropType<keyof typeof iconMap>,
      required: true
    },
  },
  setup(props) {
    return () => <span class={styles.icon}>{props.value && iconMap[props.value]}</span>
  },
})
