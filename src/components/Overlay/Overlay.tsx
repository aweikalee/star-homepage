import {
  defineComponent,
  onUnmounted,
  reactive,
  Teleport,
  Transition,
  watch,
  PropType,
  ref,
} from 'vue'
import { dom } from '../../config'

import styles from './styles.module.scss'

let id = 0
function createOverlayId() {
  return id++
}

const overlayStack = reactive<number[]>([])
watchOverlayStack()
function watchOverlayStack() {
  const body = document.body
  let oldLen = 0
  let overflow: string

  watch(
    () => overlayStack.length,
    (len) => {
      if (!len === !oldLen) return

      if (len) {
        /* 从无到有 */
        overflow = body.style.overflow
        body.style.overflow = 'hidden'
      } else {
        /* 从有到无 */
        body.style.overflow = overflow
      }

      oldLen = len
    }
  )
}

export default defineComponent({
  name: 'Overlay',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    maskColor: {
      type: String,
      default: 'rgba(0, 0, 0, 0.35)',
    },
    onMaskClick: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props, { slots }) {
    const el = {
      container: ref<HTMLElement>(),
      cell: ref<HTMLElement>(),
    }

    const id = createOverlayId()
    const mount = () => overlayStack.push(id)
    const unmount = () => {
      const index = overlayStack.indexOf(id)
      if (~index) overlayStack.splice(index, 1)
    }

    onUnmounted(unmount)
    watch(
      () => props.visible,
      (visible) => (visible ? mount() : unmount()),
      { immediate: true }
    )

    /* Mask Click */
    let maskClick = false
    const onMousedown = (e: Event) => {
      if (e.target === el.cell.value) maskClick = true
    }
    const onMousemove = (e: Event) => {
      if (!maskClick) return
      if (e.target !== el.cell.value) maskClick = false
    }
    const onMouseup = (e: Event) => {
      if (!maskClick) return
      maskClick = false
      if (e.target !== el.cell.value) return
      props.onMaskClick?.(e)
    }

    /* 阻止滚动穿透 */
    let startY = 0
    const onTouchstart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (!touch) return

      startY = touch.pageY
    }
    const onTouchmove = (e: TouchEvent) => {
      if (!e.cancelable) return

      const touch = e.touches[0]
      const container = el.container.value
      if (!touch || !container) return

      const { clientHeight, scrollTop, scrollHeight } = container

      if (startY < touch.pageY) {
        /* 往上滚 */
        if (scrollTop <= 0) {
          e.preventDefault()
        }
      } else if (startY > touch.pageY) {
        /* 往下滚 */
        if (scrollTop >= scrollHeight - clientHeight) {
          e.preventDefault()
        }
      }
    }

    return () => (
      <Teleport to={dom.overlay}>
        <Transition
          enterActiveClass={styles['enter--active']}
          enterFromClass={styles['enter--from']}
          enterToClass={styles['enter--to']}
          leaveActiveClass={styles['enter--active']}
          leaveFromClass={styles['enter--to']}
          leaveToClass={styles['enter--from']}
        >
          {() => {
            if (!props.visible) return null
            const isLatest = overlayStack[overlayStack.length - 1] === id

            return (
              <div class={styles.overlay}>
                {isLatest ? (
                  <div
                    class={styles.mask}
                    style={{ backgroundColor: props.maskColor }}
                  ></div>
                ) : null}

                <div
                  ref={el.container}
                  class={styles.container}
                  style={{
                    overflow: isLatest ? undefined : 'hidden',
                  }}
                >
                  <div class={styles.table}>
                    <div
                      ref={el.cell}
                      class={styles['table-cell']}
                      onMousedown={onMousedown}
                      onMousemove={onMousemove}
                      onMouseup={onMouseup}
                      onTouchstart={onTouchstart}
                      onTouchmove={onTouchmove}
                    >
                      {slots.default?.()}
                    </div>
                  </div>
                </div>
              </div>
            )
          }}
        </Transition>
      </Teleport>
    )
  },
})
