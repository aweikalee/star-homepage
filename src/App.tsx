import { defineComponent, onMounted } from 'vue'
import ThePhone from './components/ThePhone'
import TheCamera from './components/TheCamera'
import TheStarrySky from './components/TheStarrySky'
import TheFocus, { TheFoucsInfo } from './components/TheFocus'
import TheAlbum from './components/TheAlbum'
import TheBalance from './components/TheBalance'
import TheList from './components/TheList'
import TheNotification from './components/TheNotification'

export default defineComponent(() => {
  /* 移除页面加载动画 */
  onMounted(() => $removeLoading())

  return () => (
    <>
      <TheStarrySky />
      <ThePhone>
        {() => (
          <>
            <TheCamera>
              {() => (
                <>
                  <TheNotification />
                  <TheFoucsInfo />
                </>
              )}
            </TheCamera>
            <TheFocus />
          </>
        )}
      </ThePhone>
      <TheAlbum />
      <TheBalance />
      <TheList />
    </>
  )
})
