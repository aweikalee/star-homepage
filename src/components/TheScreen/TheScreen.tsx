import { defineComponent } from 'vue'
import TheConstellation from './TheConstellation'
import TheFoucs from './TheFoucs'

export default defineComponent({
  name: 'TheScreen',
  setup() {
    return () => (
      <>
        <TheConstellation />
        <TheFoucs />
      </>
    )
  },
})
