import { computed, defineComponent, PropType, ref, toRaw } from 'vue'
import { ISite, jojo } from '../../config'
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
    const points = ref(props.data.points)
    const isAboutMe = computed(() => {
      return props.data.title === '关于我'
    })
    const toggleJojo = () => {
      const raw = toRaw(points.value)
      const arr = jojo.filter((v) => v !== raw)
      if (!arr.length) return
      const newIndex = Math.floor(Math.random() * arr.length)
      points.value = arr[newIndex]
    }

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
          <div
            class={styles.logo}
            style={isAboutMe.value ? { cursor: 'pointer' } : undefined}
            onClick={isAboutMe.value ? toggleJojo : undefined}
          >
            <Constellation points={points.value} lines={props.data.lines} />
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
