import { defineComponent } from 'vue'
import { camera } from '../../store'
import { sites } from '../../config'
import Popup from '../Popup'
import Card from '../ConstellationInfo/Card'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'TheList',
  setup() {
    return () => (
      <Popup
        title="星座图鉴列表"
        popupClass={styles.list}
        visible={camera.visible.list}
        onMaskClick={() => camera.setVisible('list', false)}
        onCloseClick={() => camera.setVisible('list', false)}
      >
        {() => sites.map((v) => <Card data={v} />)}
      </Popup>
    )
  },
})
