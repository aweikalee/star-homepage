import {
  computed,
  defineComponent,
  onMounted,
  onUnmounted,
  reactive,
} from 'vue'
import { camera } from '../../store'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCameraTimer',
  props: {
    onTimeUp: Function,
  },
  setup(props) {
    const delay = camera.delay
    const startTime = Date.now()

    const state = reactive({
      delay: delay,
      startTime: startTime,
      endTime: startTime + delay,
    })

    let timer: NodeJS.Timeout
    const updateDelay = () => {
      const now = Date.now()
      const nextTime = state.endTime - state.delay + 1000
      if (now >= state.endTime) {
        props.onTimeUp?.()
        return
      }

      timer = setTimeout(() => {
        state.delay -= 1000
        updateDelay()
      }, nextTime - now)
    }

    onMounted(updateDelay)
    onUnmounted(() => clearTimeout(timer))

    const text = computed(() => Math.floor(state.delay / 1000))

    return () => (
      <div class={styles.timer} key={text.value}>
        {text.value}
      </div>
    )
  },
})
