import { defineComponent, onUnmounted, reactive, Transition, watch } from 'vue'
import { camera } from '../../store'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheNotification',
  setup() {
    const state = reactive({
      text: '',
      active: false,
    })

    let timer: NodeJS.Timeout
    watch(
      () => state.text,
      (text) => {
        clearTimeout(timer)
        if (text === '') return

        timer = setTimeout(() => (state.text = ''), 1000)
      }
    )
    onUnmounted(() => clearTimeout(timer))

    /* 延时 */
    watch(
      () => camera.delay,
      (value) => {
        if (value) {
          state.text = `延时 ${Math.floor(value / 1000)} 秒`
          state.active = true
        } else {
          state.text = '延时已关闭'
          state.active = false
        }
      }
    )

    /* 星座 */
    watch(
      () => camera.visible.constellation,
      (value) => {
        if (value) {
          state.text = '显示星座'
          state.active = true
        } else {
          state.text = '隐藏星座'
          state.active = false
        }
      }
    )

    /* 摄像头 */
    watch(
      () => camera.frontCamera,
      (value) => {
        state.active = false
        state.text = `${value ? '前置' : '后置'}摄像头`
      }
    )

    return () => (
      <Transition
        enterActiveClass={styles['enter--active']}
        enterFromClass={styles['enter--from']}
        enterToClass={styles['enter--to']}
        leaveActiveClass={styles['enter--active']}
        leaveFromClass={styles['enter--to']}
        leaveToClass={styles['enter--from']}
      >
        {() =>
          state.text && (
            <div class={styles.notification}>
              <span class={styles.message} data-active={state.active}>
                {state.text}
              </span>
            </div>
          )
        }
      </Transition>
    )
  },
})
