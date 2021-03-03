import { createApp } from 'vue'
import 'normalize.css'
import './index.scss'
import App from './App'
import { throttle } from './utils'

const app = document.getElementById('app')

createApp(App).mount(app)

const scrollToTop = throttle(() => window.scrollTo({ top: 0 }), 16)
const resize = () => {
  app.style.width = `${window.innerWidth}px`
  app.style.height = `${window.innerHeight}px`
  scrollToTop()
}
resize()
addEventListener('resize', resize, { capture: true })
