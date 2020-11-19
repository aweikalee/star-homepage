import { defineComponent, onMounted, reactive } from 'vue'
import ThePhone from './components/ThePhone'
import TheCamera from './components/TheCamera'
import TheStarrySky from './components/TheStarrySky'
import TheFocus, { TheFoucsInfo } from './components/TheFocus'
import TheAlbum from './components/TheAlbum'
import TheBalance from './components/TheBalance'
import TheList from './components/TheList'
import TheNotification from './components/TheNotification'
import ConstellationInfo from './components/ConstellationInfo'
import { constellation } from './store'

export default defineComponent(() => {
  /* 移除页面加载动画 */
  onMounted(() => $removeLoading())

  /* 星座图鉴 */
  const constellationInfo = reactive({
    index: -1,
  })
  const onFocusClick = () => {
    const index = constellation.data.indexOf(constellation.focus!)
    constellationInfo.index = index
  }

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
                  <TheFoucsInfo onClick={onFocusClick} />
                </>
              )}
            </TheCamera>
            <TheFocus onClick={onFocusClick} />
          </>
        )}
      </ThePhone>
      <TheAlbum />
      <TheBalance />
      <TheList />

      <ConstellationInfo
        visible={!!~constellationInfo.index}
        index={constellationInfo.index}
        onMaskClick={() => (constellationInfo.index = -1)}
        onCloseClick={() => (constellationInfo.index = -1)}
      />
    </>
  )
})
