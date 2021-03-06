import { createApp } from 'vue'
import 'normalize.css'
import './index.scss'
import App from './App'
import { viewport } from './store'

createApp(App).mount(viewport.root)
