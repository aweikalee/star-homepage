import { defineComponent } from 'vue'
import TheConstellation from './TheConstellation'

export default defineComponent({
  name: 'TheScreen',
  setup() {
    return () => (
      <>
        <TheConstellation />
      </>
    )
  },
})
