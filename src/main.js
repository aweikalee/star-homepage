import { createApp } from 'vue'
import 'normalize.css'
import './index.scss'
import App from './App'
import { throttle } from './utils'

const app = document.getElementById('app')

createApp(App).mount(app)

const resize = () => {
  app.style.width = `${window.innerWidth}px`
  app.style.height = `${window.innerHeight}px`
  window.scrollTo({ top: 0 })
}
resize()
addEventListener('resize', throttle(resize, 16))
