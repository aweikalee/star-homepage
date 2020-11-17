import { defineComponent, PropType } from 'vue'
import { camera } from '../../store'
import { preventOrbit } from '../../webgl/utils'
import Icon from '../Icon'

import styles from './styles.module.scss'

const Item = defineComponent({
  name: 'TheCameraToolBarItem',
  props: {
    active: {
      type: Boolean,
      default: false,
    },
    onClick: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class={styles.item}>
        <div
          class={styles.button}
          data-active={props.active}
          {...preventOrbit}
          onClick={(e) => {
            preventOrbit.onClick(e)
            props.onClick?.(e)
          }}
        >
          {slots.default?.()}
        </div>
      </div>
    )
  },
})

export default defineComponent({
  name: 'TheCameraToolBar',
  setup() {
    return () => (
      <div class={styles.toolbar}>
        {/* 星座 */}
        <Item
          active={camera.visible.constellation}
          onClick={() => {
            camera.toggleVisible('constellation')
          }}
        >
          {() => <Icon value="constellation" />}
        </Item>

        {/* 延时 */}
        <Item
          active={!!camera.delay}
          onClick={() => {
            camera.toggleDelay()
          }}
        >
          {() => (
            <>
              <Icon value="timer" />
              {camera.delay ? (
                <span class={styles.description}>{camera.delay / 1000}秒</span>
              ) : null}
            </>
          )}
        </Item>

        {/* 色彩平衡 */}
        <Item
          onClick={() => {
            camera.toggleVisible('balance')
          }}
        >
          {() => <Icon value="balance" />}
        </Item>

        {/* 图鉴 */}
        <Item
          onClick={() => {
            camera.toggleVisible('list')
          }}
        >
          {() => <Icon value="list" />}
        </Item>
      </div>
    )
  },
})
