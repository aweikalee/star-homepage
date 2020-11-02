import {
  computed,
  defineComponent,
  nextTick,
  reactive,
  Transition,
  watch,
} from 'vue'
import { album, pushPhoto } from '../../store'
import { preventOrbit } from '../../webgl/utils'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCamera',
  setup(props, { slots }) {
    const state = reactive({
      showAlbumButton: true, // 用于产生 album 按钮刷新动画
      mask: false,
    })

    const thumbnail = computed<string | undefined>(() => {
      return album.data[album.data.length - 1]
    })
    watch(thumbnail, () => {
      state.showAlbumButton = false
      nextTick(() => {
        state.showAlbumButton = true
      })
    })

    return () => (
      <div class={styles.camera}>
        <div class={styles.toolbar}>
          {['🐁', '🐂', '🐅', '🐇', '🐏'].map((v) => (
            <div class={styles.toolbar__button}>{v}</div>
          ))}
        </div>

        <div class={styles.view}>{slots.default?.()}</div>

        <div class={styles.shutterbar}>
          <div class={styles.album}>
            <Transition
              enterActiveClass={styles['scale-in--active']}
              enterFromClass={styles['scale-in--from']}
              enterToClass={styles['scale-in--to']}
            >
              {() =>
                state.showAlbumButton && (
                  <div
                    class={styles.album__button}
                    style={{
                      backgroundImage: thumbnail.value
                        ? `url(${thumbnail.value})`
                        : undefined,
                    }}
                  ></div>
                )
              }
            </Transition>
          </div>

          <div class={styles.shutter}>
            <div
              class={styles.shutter__button}
              {...preventOrbit}
              onClick={(e) => {
                preventOrbit.onClick(e)
                state.mask = true

                album.takePhoto().toBlob((blob) => {
                  const url = URL.createObjectURL(blob)
                  pushPhoto(url)
                })
              }}
            ></div>
          </div>

          <div class={styles.switch}>
            <div class={styles.switch__button}>📷</div>
          </div>
        </div>

        <Transition
          leaveActiveClass={styles['fade-in--active']}
          leaveFromClass={styles['fade-in--from']}
          leaveToClass={styles['fade-in--to']}
          onEnter={() => (state.mask = false)}
        >
          {() => state.mask && <div class={styles.mask}></div>}
        </Transition>
      </div>
    )
  },
})
