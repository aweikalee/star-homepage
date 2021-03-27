import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginString from 'vite-plugin-string'
import htmlPorter from './plugins/htmlPorter'
import baiduAnalytics from './plugins/baiduAnalytics'

export default <UserConfig>{
  esbuildTarget: 'es6',
  plugins: [
    vue(),
    vueJsx(),
    vitePluginString(),

    /* 将 </title> 到 </head> 之间的内容移至 </body> 之前 */
    htmlPorter([
      {
        range: {
          start: '</title>',
          end: '</head>',
        },
        target: '</body>',
        type: 'pre',
      },
    ]),

    /* 百度统计 */
    baiduAnalytics('688767575360f4fcf32801af3d9a2137')
  ],
  optimizeDeps: {
    include: ['photoswipe/dist/photoswipe-ui-default'],
  },
}
