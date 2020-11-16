import { computed, defineComponent, PropType } from 'vue'
import { ISite } from '../../config'

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
    const points = computed(() => {
      const res: [number, number][] = []
      const { points } = props.data
      for (let i = 0; i < points.length; i += 2) {
        const point = transformPoint([points[i], points[i + 1]])
        res.push(point)
      }
      return res
    })

    const lines = computed(() => {
      const res: [number, number][] = []
      const { lines } = props.data
      for (let i = 0; i < lines.length; i += 2) {
        res.push([lines[i], lines[i + 1]])
      }
      return res
    })

    return () => (
      <div class={styles.card}>
        <a href={props.data.url} class={styles.logo} target="blank">
          <svg
            viewBox="-100 -100 200 200"
            version="1.1"
            {...{ xmlns: 'http://www.w3.org/2000/svg' }}
          >
            {points.value.map(([x, y]) => (
              <circle cx={x} cy={y} r="4" fill="currentColor" />
            ))}
            {lines.value.map(([a, b]) => {
              const p = points.value
              const [x1, y1] = p[a] ?? []
              const [x2, y2] = p[b] ?? []
              return (
                <line
                  x1={x1}
                  y1={y1}
                  x2={x2}
                  y2={y2}
                  stroke="currentColor"
                  fill="transparent"
                  stroke-width="2"
                />
              )
            })}
          </svg>
        </a>
        <div class={styles.content}>
          <div class={styles.title}>
            <a href={props.data.url} target="blank">
              {props.data.title}
            </a>
          </div>
          <div class={styles.description}>
            <a href={props.data.url} target="blank">
              {props.data.description}
            </a>
          </div>
        </div>
      </div>
    )
  },
})

function transformPoint([x, y]: [number, number]): [number, number] {
  return [x, -y]
}
