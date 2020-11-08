import {
  computed,
  defineComponent,
  nextTick,
  onUnmounted,
  reactive,
  ref,
  Transition,
  watch,
} from 'vue'
import {
  album,
  pushPhoto,
  setAlbumButtonElement,
  setAlbumVisible,
} from '../../store'
import { preventOrbit } from '../../webgl/utils'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCamera',
  setup(props, { slots }) {
    const state = reactive({
      showAlbumButton: true, // 用于产生 album 按钮刷新动画
      shutterMask: false,
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

    const onShutterClick = (e: Event) => {
      preventOrbit.onClick(e)
      state.shutterMask = true
    }

    const onShutterClosed = () => {
      try {
        album.takePhoto().toBlob((blob) => {
          state.shutterMask = false

          const url = URL.createObjectURL(blob)
          pushPhoto(url)
        })
      } catch (err) {
        state.shutterMask = false
        throw err
      }
    }

    const elButton = ref<HTMLElement>()
    watch(elButton, (el) => setAlbumButtonElement(el ?? null))
    onUnmounted(() => setAlbumButtonElement(null))

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
                    {...preventOrbit}
                    onClick={(e) => setAlbumVisible(true)}
                    ref={elButton}
                  ></div>
                )
              }
            </Transition>
          </div>

          <div class={styles.shutter}>
            <div
              class={styles.shutter__button}
              {...preventOrbit}
              onClick={onShutterClick}
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
          onEnter={onShutterClosed}
        >
          {() => state.shutterMask && <div class={styles.mask}></div>}
        </Transition>
      </div>
    )
  },
})
