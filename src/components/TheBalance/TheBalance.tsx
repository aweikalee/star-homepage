import { defineComponent, Transition } from 'vue'
import { camera } from '../../store'
import Overlay, { useVisibleState } from '../Overlay'
import Slider from '../Slider'
import Switch from '../Switch'

import styles from './styles.module.scss'

const MIN = 0
const MAX = 2
const STEP = 0.05

export default defineComponent({
  name: 'TheBalance',
  setup() {
    const visible = useVisibleState(() => camera.visible.balance)

    const setBalance = (value: number, key: number) => {
      const clone = camera.balance.clone()
      clone[key] = value
      camera.setBalance(clone)
    }
    return () => (
      <Overlay
        visible={visible.overlay}
        onMaskClick={() => camera.setVisible('balance', false)}
      >
        {() => (
          <Transition
            enterActiveClass={styles['slide-in--active']}
            enterFromClass={styles['slide-in--from']}
            enterToClass={styles['slide-in--to']}
            leaveActiveClass={styles['slide-in--active']}
            leaveFromClass={styles['slide-in--to']}
            leaveToClass={styles['slide-in--from']}
          >
            {() =>
              visible.content ? (
                <div class={styles.balance}>
                  {['R', 'G', 'B'].map((text, key) => (
                    <div class={styles.row}>
                      <div class={styles.label}>{text}</div>
                      <div class={styles.content}>
                        <Slider
                          value={camera.balance[key]}
                          onChange={(v) => setBalance(v, key)}
                          min={MIN}
                          max={MAX}
                          step={STEP}
                        />
                      </div>
                    </div>
                  ))}

                  <div class={styles.row}>
                    <div class={styles.label}>去色</div>
                    <div class={styles.content}>
                      <Switch
                        value={camera.desaturate}
                        onChange={camera.setDesaturate}
                        style={{
                          display: 'block',
                          marginLeft: '0.24rem',
                        }}
                      />
                    </div>
                  </div>
                </div>
              ) : null
            }
          </Transition>
        )}
      </Overlay>
    )
  },
})
