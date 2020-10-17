import { defineComponent } from 'vue'
import { beian } from '../../config'

export default defineComponent({
  name: 'TheFooter',
  setup() {
    return () => (
      <div>
        <div>
          DESIGN BY <a href="https://github.com/aweikalee">@AWEIKALEE (毛呆)</a>
        </div>

        <div>
          <a href={beian.url}>{beian.text}</a>
        </div>
      </div>
    )
  },
})
