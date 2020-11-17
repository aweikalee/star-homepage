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
    title: {
      type: String,
    },
    onClick: {
      type: Function as PropType<(e: Event) => void>,
    },
  },
  setup(props, { slots }) {
    return () => (
      <div class={styles.item}>
        <div
          title={props.title}
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
        <Item
          title="显示星座"
          active={camera.visible.constellation}
          onClick={() => {
            camera.toggleVisible('constellation')
          }}
        >
          {() => <Icon value="constellation" />}
        </Item>

        <Item
          title="延时"
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

        <Item
          title="色彩平衡"
          onClick={() => {
            camera.toggleVisible('balance')
          }}
        >
          {() => <Icon value="balance" />}
        </Item>

        <Item
          title="星座图鉴"
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
