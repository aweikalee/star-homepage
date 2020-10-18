import { ref, onMounted, onUnmounted } from 'vue'

export function useRaf(handler: Function) {
  const raf = ref<number>()

  const fn = () => {
    raf.value = requestAnimationFrame(fn)
    handler()
  }
  onMounted(() => fn())
  onUnmounted(() => raf.value && cancelAnimationFrame(raf.value))

  return raf
}
