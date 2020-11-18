import { defineComponent, PropType } from 'vue'
import { ISite } from '../../config'
import Constellation from '../Constellation'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheListCard',
  props: {
    data: {
      type: Object as PropType<ISite>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class={styles.card}>
        <a href={props.data.url} class={styles.logo} target="blank">
          <Constellation points={props.data.points} lines={props.data.lines} />
        </a>
        <div class={styles.content}>
          <div class={styles.title}>
            <a href={props.data.url} target="blank">
              {props.data.title}
            </a>
          </div>
          <div class={styles.description}>
            <a href={props.data.url} target="blank">
              {props.data.description?.split('\n').map((v) => (
                <div>{v}</div>
              ))}
            </a>
          </div>
        </div>
      </div>
    )
  },
})
