import { computed, defineComponent, reactive, ref } from 'vue'
import { album, camera } from '../../store'
import Popup from '../Popup'
import Swiper, { PhotoSwipe } from '../Swiper'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheAlbum',
  props: {},
  setup() {
    const el = ref<HTMLElement>()
    const swiper = reactive({
      visible: false,
      index: 0,
    })

    const items = computed(() => {
      return album.photos.map(({ src, w, h }) => ({
        src,
        msrc: src,
        w,
        h,
      }))
    })

    const getThumbBoundsFn: PhotoSwipe.Options['getThumbBoundsFn'] = (
      index
    ) => {
      if (!el.value) return undefined as any
      const lists = el.value.children
      const item = items.value[index]

      const pageYScroll =
        window.pageYOffset || document.documentElement.scrollTop

      const thumbnail = lists[index]
      if (!thumbnail) return undefined as any
      const rect = thumbnail.getBoundingClientRect()

      let x = rect.left
      let y = rect.top + pageYScroll
      let { w, h } = item

      if (w > h) {
        w = (w * rect.height) / h
        h = rect.height
        x -= (w - h) / 2
      } else {
        h = (h * rect.width) / w
        w = rect.width
        y -= (h - w) / 2
      }

      return {
        x,
        y,
        w,
      }
    }

    return () => (
      <Popup
        title="相册"
        visible={camera.visible.album}
        startTarget={album.buttonElement as HTMLElement}
        transition="scale"
        onMaskClick={() => camera.setVisible('album', false)}
        onCloseClick={() => camera.setVisible('album', false)}
      >
        {() => (
          <>
            <div class={styles.album} ref={el}>
              {album.photos.map(({ src }, index) => (
                <div class={styles.item} key={src}>
                  <div
                    onClick={() => {
                      swiper.visible = true
                      swiper.index = index
                    }}
                    style={{
                      backgroundImage: `url(${src})`,
                    }}
                  ></div>
                </div>
              ))}

              {album.photos.length === 0 ? (
                <div class={styles.none}>这里空空如也</div>
              ) : null}
            </div>

            {swiper.visible ? (
              <Swiper
                items={items.value}
                options={{
                  getThumbBoundsFn,
                  index: swiper.index,
                }}
                onClose={() => (swiper.visible = false)}
              />
            ) : null}
          </>
        )}
      </Popup>
    )
  },
})
