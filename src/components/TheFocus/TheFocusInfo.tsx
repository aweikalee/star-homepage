import { defineComponent, PropType } from 'vue'
import { constellation } from '../../store'

import styles from './styles.module.scss'
import { preventOrbit } from '../../webgl/utils'

export default defineComponent({
  name: 'TheFoucsInfo',
  props: {
    onClick: {
      type: Function,
    },
  },
  setup(props) {
    return () => {
      const focus = constellation.focus
      if (!focus) return null

      return (
        <div class={styles.info}>
          <div
            title={focus.title}
            {...preventOrbit}
            onClick={(e) => {
              preventOrbit.onClick(e)
              props.onClick?.()
            }}
          >
            {focus.title}
          </div>
        </div>
      )
    }
  },
})
