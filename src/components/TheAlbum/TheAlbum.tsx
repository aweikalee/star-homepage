import { defineComponent } from 'vue'
import { album, camera } from '../../store'
import Popup from '../Popup'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheAlbum',
  props: {},
  setup() {
    return () => (
      <Popup
        title="相册"
        visible={camera.visible.album}
        startTarget={album.buttonElement as HTMLElement}
        transition="scale"
        onMaskClick={() => camera.setVisible('album', false)}
        onCloseClick={() => camera.setVisible('album', false)}
      >
        {() => (
          <>
            <div class={styles.album}>
              {album.photos.map((url) => (
                <div class={styles.item} key={url}>
                  <a
                    href={url}
                    style={{
                      backgroundImage: `url(${url})`,
                    }}
                    target="blank"
                  />
                </div>
              ))}

              {album.photos.length === 0 ? (
                <div class={styles.none}>这里空空如也</div>
              ) : null}
            </div>
          </>
        )}
      </Popup>
    )
  },
})
