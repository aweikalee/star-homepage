import { defineComponent, PropType } from 'vue'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'Switch',
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    onChange: {
      type: Function as PropType<(value: boolean) => void>,
    },
  },
  setup(props) {
    const onClick = () => {
      props.onChange?.(!props.value)
    }
    return () => (
      <div
        class={styles.switch}
        data-active={props.value}
        onClick={onClick}
      ></div>
    )
  },
})
