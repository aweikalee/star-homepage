import { defineComponent, nextTick, ref, Transition, watch } from 'vue'
import { album, camera } from '../../store'
import Overlay, { useVisibleState } from '../Overlay'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheAlbum',
  props: {},
  setup() {
    const visible = useVisibleState(() => camera.visible.album)

    /* 更新 Transform Origin */
    const el = ref<HTMLElement>()
    const updateTransformOrigin = () => {
      const button = album.buttonElement
      const content = el.value
      if (!button || !content) return

      const start = button.getBoundingClientRect()
      const end = content.getBoundingClientRect()
      const origin = `${start.left - end.left}px ${start.top - end.top}px`
      setTransformOrigin(content, origin)
    }
    watch(
      () => camera.visible.album,
      (value) => {
        if (value) {
          /* enter */
          nextTick(() => nextTick(updateTransformOrigin))
        } else {
          /* leave */
          updateTransformOrigin()
        }
      }
    )

    return () => (
      <Overlay
        visible={visible.overlay}
        onMaskClick={() => camera.setVisible('album', false)}
      >
        {() => (
          <Transition
            enterActiveClass={styles['enter--active']}
            enterFromClass={styles['enter--from']}
            enterToClass={styles['enter--to']}
            leaveActiveClass={styles['enter--active']}
            leaveFromClass={styles['enter--to']}
            leaveToClass={styles['enter--from']}
          >
            {() =>
              visible.content ? (
                <div class={styles.album} ref={el}>
                  <div class={styles.header}>
                    相簿
                    <div
                      class={styles.close}
                      onClick={() => camera.setVisible('album', false)}
                    >
                      X
                    </div>
                  </div>

                  <div class={styles.content}>
                    {album.photos.map((url) => (
                      <div class={styles.item} key={url}>
                        <a
                          href={url}
                          style={{
                            backgroundImage: `url(${url})`,
                          }}
                          target="blank"
                        />
                      </div>
                    ))}

                    {album.photos.length === 0 ? (
                      <div class={styles.none}>这里空空如也</div>
                    ) : null}
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

function setTransformOrigin(el: HTMLElement, value: string) {
  const style = el.style
  const keys = [
    'WebkitTransformOrigin',
    'MozTransformOrigin',
    'Ms',
    'msTransformOrigin',
    'transformOrigin',
  ]
  keys.forEach((key) => ((style as any)[key] = value))
}
