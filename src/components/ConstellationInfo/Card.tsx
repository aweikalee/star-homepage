import { defineComponent, PropType } from 'vue'
import { ISite } from '../../config'
import Constellation from '../Constellation'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'ConstellationInfoCard',
  props: {
    data: {
      type: Object as PropType<ISite>,
      required: true,
    },
  },
  setup(props) {
    return () => (
      <div class={styles.card}>
        {props.data.url ? (
          <a href={props.data.url} class={styles.logo} target="blank">
            <Constellation
              points={props.data.points}
              lines={props.data.lines}
            />
          </a>
        ) : (
          <div class={styles.logo}>
            <Constellation
              points={props.data.points}
              lines={props.data.lines}
            />
          </div>
        )}

        <div class={styles.content}>
          <div class={styles.title}>{props.data.title}</div>

          <div class={styles.description}>{props.data.description}</div>

          {props.data.url ? (
            <div class={styles.link}>
              <a href={props.data.url} target="blank">
                Link Start
              </a>
            </div>
          ) : null}
        </div>
      </div>
    )
  },
})
