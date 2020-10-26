import { defineComponent, onMounted } from 'vue'
import ThePhone from './components/ThePhone'
import TheCamera from './components/TheCamera'
import TheStarrySky from './components/TheStarrySky'
import TheFocus from './components/TheFocus'

export default defineComponent(() => {
  /* 移除页面加载动画 */
  onMounted(() => $removeLoading())

  return () => (
    <>
      <TheStarrySky />
      <ThePhone>{() => <TheCamera>{() => <TheFocus />}</TheCamera>}</ThePhone>
    </>
  )
})
