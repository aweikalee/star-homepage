import { createApp } from 'vue'
import 'normalize.css'
import './index.scss'
import App from './App'
import { dom } from './config'

createApp(App).mount(dom.root)
