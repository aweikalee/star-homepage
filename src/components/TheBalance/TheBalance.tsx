import { defineComponent } from 'vue'
import { camera } from '../../store'
import Popup from '../Popup'
import Slider from '../Slider'
import Switch from '../Switch'

import styles from './styles.module.scss'

const MIN = 0
const MAX = 2
const STEP = 0.05

export default defineComponent({
  name: 'TheBalance',
  setup() {
    const setBalance = (value: number, key: number) => {
      const clone = camera.balance.clone()
      clone[key] = value
      camera.setBalance(clone)
    }
    return () => (
      <Popup
        title="色彩平衡"
        popupClass={styles.balance}
        visible={camera.visible.balance}
        maskColor="transparent"
        onMaskClick={() => camera.setVisible('balance', false)}
        onCloseClick={() => camera.setVisible('balance', false)}
      >
        {() => (
          <>
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
          </>
        )}
      </Popup>
    )
  },
})
