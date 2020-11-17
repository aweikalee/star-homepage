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
import { album, camera } from '../../store'
import { preventOrbit } from '../../webgl/utils'
import Icon from '../Icon'
import ToolBar from './ToolBar'
import Timer from './Timer'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheCamera',
  setup(props, { slots }) {
    const state = reactive({
      albumButtonVisible: true, // 用于产生 album 按钮刷新动画
      shutterMask: false,
    })

    const thumbnail = computed<string | undefined>(() => {
      return album.photos[album.photos.length - 1]
    })
    watch(thumbnail, () => {
      state.albumButtonVisible = false
      nextTick(() => (state.albumButtonVisible = true))
    })

    const runTakePhoto = () => (state.shutterMask = true)
    const takePhoto = () => {
      const canvas = album.takePhoto()
      if (!canvas) return (state.shutterMask = false)

      canvas.toBlob((blob) => {
        const url = URL.createObjectURL(blob)
        album.pushPhoto(url)
        state.shutterMask = false
      })
    }
    const onTimerEnd = () => {
      camera.setVisible('timer', false)
      runTakePhoto()
    }

    /* 提交elButton 用于计算 TheAblum 显隐动画 Origin */
    const elButton = ref<HTMLElement>()
    watch(elButton, (el) => album.setButtonElement(el ?? null))
    onUnmounted(() => album.setButtonElement(null))

    return () => (
      <div class={styles.camera}>
        <ToolBar />

        <div class={styles.view}>
          {slots.default?.()}
          {camera.visible.timer && <Timer onTimeUp={onTimerEnd} />}
        </div>

        <div class={styles.shutterbar}>
          <div class={styles.album}>
            <Transition
              enterActiveClass={styles['scale-in--active']}
              enterFromClass={styles['scale-in--from']}
              enterToClass={styles['scale-in--to']}
            >
              {() =>
                state.albumButtonVisible && (
                  <div
                    class={styles.album__button}
                    style={{
                      backgroundImage: thumbnail.value
                        ? `url(${thumbnail.value})`
                        : undefined,
                    }}
                    {...preventOrbit}
                    onClick={(e) => {
                      preventOrbit.onClick(e)
                      camera.setVisible('album', true)
                    }}
                    ref={elButton}
                  ></div>
                )
              }
            </Transition>
          </div>

          <div class={styles.shutter}>
            <div
              class={styles.shutter__button}
              data-active={camera.visible.timer}
              {...preventOrbit}
              onClick={(e) => {
                preventOrbit.onClick(e)
                camera.toggleVisible('timer')
              }}
            ></div>
          </div>

          <div class={styles.switch}>
            <div
              class={styles.switch__button}
              {...preventOrbit}
              onClick={(e) => {
                preventOrbit.onClick(e)
                camera.toggleFrontCamera()
              }}
            >
              <Icon value="camera" />
            </div>
          </div>
        </div>

        <Transition
          leaveActiveClass={styles['fade-in--active']}
          leaveFromClass={styles['fade-in--from']}
          leaveToClass={styles['fade-in--to']}
          onEnter={takePhoto}
        >
          {() => state.shutterMask && <div class={styles.mask}></div>}
        </Transition>
      </div>
    )
  },
})
