import { defineComponent, onMounted } from 'vue'
import TheFooter from './components/TheFooter'

export default defineComponent(() => {
  /* 移除页面加载动画 */
  onMounted(() => $removeLoading())

  return () => (
    <div>
      <TheFooter />
    </div>
  )
})
