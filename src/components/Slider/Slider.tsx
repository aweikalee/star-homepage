import { computed, defineComponent, PropType, reactive, ref, watch } from 'vue'

import styles from './styles.module.scss'

export default defineComponent({
  name: 'Slider',
  props: {
    value: {
      type: Number,
      default: 0,
    },
    min: {
      type: Number,
      default: 0,
    },
    max: {
      type: Number,
      default: 100,
    },
    step: {
      type: Number,
      default: 1,
    },
    onChange: {
      type: Function as PropType<(value: number) => void>,
    },
  },
  setup(props) {
    const el = {
      slider: ref<HTMLElement>(),
      handle: ref<HTMLElement>(),
    }
    const state = reactive({
      value: 0,
      percentage: 0,
    })
    const formatValue = (value: number) => {
      const min = props.min
      const max = props.max
      const step = props.step

      let newValue = Math.max(Math.min(value, max), min)
      newValue = Math.round(newValue / step) * step

      return newValue
    }
    watch(
      () => ({
        value: props.value,
        min: props.min,
        max: props.max,
      }),
      ({ value }) => {
        state.value = formatValue(value)
      },
      { immediate: true }
    )
    watch(
      () => state.value,
      (value) => {
        state.percentage = (value - props.min) / (props.max - props.min)
      },
      { immediate: true }
    )

    const calcValueByPosition = (position: number, slider: HTMLElement) => {
      const rectSlider = slider.getBoundingClientRect()
      const start = window.pageXOffset + rectSlider.left
      const end = start + rectSlider.width
      const value = (position - start) / (end - start)
      return formatValue(props.min + value * (props.max - props.min))
    }

    function onStart(position: number) {
      if (!el.slider.value) return
      const value = calcValueByPosition(position, el.slider.value)
      props.onChange?.(value)
    }
    function onMove(position: number) {
      if (!el.slider.value) return
      const value = calcValueByPosition(position, el.slider.value)
      props.onChange?.(value)
    }
    function onEnd() {}

    /* MouseEvent */
    function onMouseDown(e: MouseEvent) {
      if (e.button !== 0) return
      const position = getMousePosition(e)
      onStart(position)
      addMouseEvents()
    }
    function onMouseMove(e: MouseEvent) {
      const position = getMousePosition(e)
      onMove(position)
    }
    function onMouseUp(e: MouseEvent) {
      removeMouseEvents()
      onEnd()
    }

    function addMouseEvents() {
      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }
    function removeMouseEvents() {
      document.removeEventListener('mousemove', onMouseMove)
      document.removeEventListener('mouseup', onMouseUp)
    }

    /* TouchEvent */
    function onTouchStart(e: TouchEvent) {
      const position = getTouchPosition(e)
      onStart(position)
      addTouchEvents()
    }
    function onTouchMove(e: TouchEvent) {
      const position = getTouchPosition(e)
      onMove(position)
    }
    function onTouchEnd(e: TouchEvent) {
      removeTouchEvents()
      onEnd()
    }

    function addTouchEvents() {
      document.addEventListener('touchmove', onTouchMove)
      document.addEventListener('touchend', onTouchEnd)
    }
    function removeTouchEvents() {
      document.removeEventListener('touchmove', onTouchMove)
      document.removeEventListener('touchend', onTouchEnd)
    }

    return () => (
      <div
        ref={el.slider}
        class={styles.slider}
        onMousedown={onMouseDown}
        onTouchstart={onTouchStart}
        onDrag={(e) => e.preventDefault()}
      >
        <div class={styles.rail}></div>

        <div
          class={styles.track}
          style={{
            width: `${state.percentage * 100}%`,
          }}
        ></div>

        <div
          ref={el.handle}
          class={styles.handle}
          style={{
            left: `${state.percentage * 100}%`,
          }}
        ></div>
      </div>
    )
  },
})

function getMousePosition(e: MouseEvent) {
  let zoom = 1
  if (window.visualViewport) {
    zoom = +(
      window.visualViewport.width / document.body.getBoundingClientRect().width
    ).toFixed(2)
  }
  return e.pageX / zoom
}

function getTouchPosition(e: TouchEvent) {
  let zoom = 1
  if (window.visualViewport) {
    zoom = +(
      window.visualViewport.width / document.body.getBoundingClientRect().width
    ).toFixed(2)
  }
  return e.touches[0].pageX / zoom
}

function getHandleCetnerPosition(handle: HTMLElement) {
  const coords = handle.getBoundingClientRect()
  return window.pageXOffset + coords.left + coords.width * 0.5
}
