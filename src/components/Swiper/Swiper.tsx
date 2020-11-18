import { defineComponent, PropType, ref, onMounted, Teleport } from 'vue'
import PhotoSwipe from 'photoswipe'
import PhotoSwipeUI_Default from 'photoswipe/dist/photoswipe-ui-default'

export { PhotoSwipe }

import 'photoswipe/dist/photoswipe.css'
import 'photoswipe/dist/default-skin/default-skin.css'
import './styles.scss'

export default defineComponent({
  name: 'Swiper',
  props: {
    items: {
      type: Array as PropType<PhotoSwipe.Item[]>,
      default: [],
    },
    options: {
      type: Object as PropType<PhotoSwipe.Options>,
      default: {},
    },
    onClose: {
      type: Function,
    },
  },
  setup(props) {
    const el = ref<HTMLElement>()
    onMounted(() => init())

    function init() {
      if (!el.value) return

      const swipe = new PhotoSwipe(
        el.value,
        PhotoSwipeUI_Default,
        props.items,
        {
          history: false,
          shareEl: false,
          fullscreenEl: false,
          ...props.options,
        }
      )

      listen(swipe)

      swipe.init()
    }

    function listen(swipe: PhotoSwipe<PhotoSwipe.Options>) {
      /* 更新图片实际尺寸 */
      swipe.listen('imageLoadComplete', (index, item) => {
        const img = new Image()
        img.src = item.src!
        img.onload = () => {
          item.w = img.width
          item.h = img.height
          swipe.updateSize(true)
        }
      })

      /* 关闭 */
      swipe.listen('destroy', () => props.onClose?.())
    }

    return () => (
      <Teleport to="#overlay">
        <div
          class="pswp"
          tabindex={-1}
          role="dialog"
          aria-hidden="true"
          ref={el}
        >
          <div class="pswp__bg"></div>

          <div class="pswp__scroll-wrap">
            <div class="pswp__container">
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
              <div class="pswp__item"></div>
            </div>

            <div class="pswp__ui pswp__ui--hidden">
              <div class="pswp__top-bar">
                <div class="pswp__counter"></div>

                <button
                  class="pswp__button pswp__button--close"
                  title="Close (Esc)"
                ></button>

                <button
                  class="pswp__button pswp__button--share"
                  title="Share"
                ></button>

                <button
                  class="pswp__button pswp__button--fs"
                  title="Toggle fullscreen"
                ></button>

                <button
                  class="pswp__button pswp__button--zoom"
                  title="Zoom in/out"
                ></button>

                <div class="pswp__preloader">
                  <div class="pswp__preloader__icn">
                    <div class="pswp__preloader__cut">
                      <div class="pswp__preloader__donut"></div>
                    </div>
                  </div>
                </div>
              </div>

              <div class="pswp__share-modal pswp__share-modal--hidden pswp__single-tap">
                <div class="pswp__share-tooltip"></div>
              </div>

              <button
                class="pswp__button pswp__button--arrow--left"
                title="Previous (arrow left)"
              ></button>

              <button
                class="pswp__button pswp__button--arrow--right"
                title="Next (arrow right)"
              ></button>

              <div class="pswp__caption">
                <div class="pswp__caption__center"></div>
              </div>
            </div>
          </div>
        </div>
      </Teleport>
    )
  },
})
