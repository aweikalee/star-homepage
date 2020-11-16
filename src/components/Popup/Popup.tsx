import {
  defineComponent,
  Transition,
  watch,
  PropType,
  ref,
  nextTick,
  computed,
  TransitionProps,
} from 'vue'
import Overlay, { useVisibleState } from '../Overlay'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'Popup',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    maskColor: {
      type: String,
    },
    onMaskClick: {
      type: Function as PropType<(e: Event) => void>,
    },
    onCloseClick: {
      type: Function as PropType<(e: Event) => void>,
    },

    title: {
      type: String,
    },
    startTarget: {
      type: Object as PropType<HTMLElement>,
    },
    popupClass: {
      type: String,
    },
    transition: {
      type: String as PropType<'scale' | 'slide'>,
      default: 'slide',
    },
  },
  setup(props, { slots }) {
    const visible = useVisibleState(() => props.visible)

    /* 更新 Transform Origin */
    const el = ref<HTMLElement>()
    const updateTransformOrigin = () => {
      const target = props.startTarget
      const content = el.value
      if (!content) return
      if (target) {
        const start = target.getBoundingClientRect()
        const end = content.getBoundingClientRect()
        const origin = `${start.left - end.left}px ${start.top - end.top}px`
        setTransformOrigin(content, origin)
      } else {
        setTransformOrigin(content, null)
      }
    }
    watch(
      () => props.visible,
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

    const transitionClass = computed<TransitionProps>(() => {
      switch (props.transition) {
        case 'scale':
          return {
            enterActiveClass: styles['scale--active'],
            enterFromClass: styles['scale--from'],
            enterToClass: styles['scale--to'],
            leaveActiveClass: styles['scale--active'],
            leaveFromClass: styles['scale--to'],
            leaveToClass: styles['scale--from'],
          }
        default:
          return {
            enterActiveClass: styles['slide--active'],
            enterFromClass: styles['slide--from'],
            enterToClass: styles['slide--to'],
            leaveActiveClass: styles['slide--active'],
            leaveFromClass: styles['slide--to'],
            leaveToClass: styles['slide--from'],
          }
      }
    })

    return () => (
      <Overlay
        visible={visible.overlay}
        maskColor={props.maskColor}
        onMaskClick={props.onMaskClick}
      >
        {() => (
          <Transition {...transitionClass.value}>
            {() =>
              visible.content ? (
                <div class={[styles.popup, props.popupClass]} ref={el}>
                  <div class={styles.header}>
                    {props.title}
                    <div class={styles.close} onClick={props.onCloseClick}>
                      ×
                    </div>
                  </div>

                  {slots.default?.()}
                </div>
              ) : null
            }
          </Transition>
        )}
      </Overlay>
    )
  },
})

function setTransformOrigin(el: HTMLElement, value: string | null) {
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
