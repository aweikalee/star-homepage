import { nextTick, reactive, watch } from 'vue'

/* 控制 Overlay 和 slots 中两个 Transition 先后顺序 */
export function useVisibleState(getVisibleValue: () => boolean) {
  const visible = reactive({
    overlay: getVisibleValue(),
    content: getVisibleValue(),
  })
  watch(getVisibleValue, (value) => {
    if (value) {
      /* enter */
      visible.overlay = value
      nextTick(() => (visible.content = value))
    } else {
      /* leave */
      visible.content = value
      nextTick(() => (visible.overlay = value))
    }
  })

  return visible
}
