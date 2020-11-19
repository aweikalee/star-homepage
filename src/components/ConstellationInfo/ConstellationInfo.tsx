import { computed, defineComponent, PropType } from 'vue'
import { sites } from '../../config'
import Popup from '../Popup'
import Card from './Card'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'ConstellationInfo',
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
    },
    onMaskClick: {
      type: Function as PropType<(e: Event) => void>,
    },
    onCloseClick: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props) {
    const data = computed(() => {
      return sites[props.index ?? 0] ?? sites[0]
    })
    return () => (
      <Popup
        title="星座图鉴"
        popupClass={styles.constellation}
        visible={props.visible}
        onMaskClick={props.onMaskClick}
        onCloseClick={props.onCloseClick}
      >
        {() => (data.value ? <Card data={data.value} /> : null)}
      </Popup>
    )
  },
})
