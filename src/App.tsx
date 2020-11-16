import { defineComponent, onMounted } from 'vue'
import ThePhone from './components/ThePhone'
import TheCamera from './components/TheCamera'
import TheStarrySky from './components/TheStarrySky'
import TheFocus from './components/TheFocus'
import TheAlbum from './components/TheAlbum'
import TheBalance from './components/TheBalance'
import TheList from './components/TheList'

export default defineComponent(() => {
  /* 移除页面加载动画 */
  onMounted(() => $removeLoading())

  return () => (
    <>
      <TheStarrySky />
      <ThePhone>{() => <TheCamera>{() => <TheFocus />}</TheCamera>}</ThePhone>
      <TheAlbum />
      <TheBalance />
      <TheList />
    </>
  )
})
