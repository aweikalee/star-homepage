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
    onMaskClick: {
      type: Function as PropType<(e: Event) => void>,
    },
    mousePosition: {
      type: Object as PropType<{
        x: number
        y: number
      }>,
    },
  },
  setup(props, { slots }) {
    const el = ref<HTMLElement>()

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
      if (e.target === el.value) maskClick = true
    }
    const onMousemove = (e: Event) => {
      if (!maskClick) return
      if (e.target !== el.value) maskClick = false
    }
    const onMouseup = (e: Event) => {
      if (!maskClick) return
      maskClick = false
      if (e.target !== el.value) return
      props.onMaskClick?.(e)
    }

    return () => (
      <Teleport to="#overlay">
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
                {isLatest ? <div class={styles.mask}></div> : null}

                <div
                  class={styles.container}
                  style={{
                    overflow: isLatest ? undefined : 'hidden',
                  }}
                  ref={el}
                  onMousedown={onMousedown}
                  onMousemove={onMousemove}
                  onMouseup={onMouseup}
                >
                  {slots.default?.()}
                </div>
              </div>
            )
          }}
        </Transition>
      </Teleport>
    )
  },
})
