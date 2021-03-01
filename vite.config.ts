import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginString from 'vite-plugin-string'
import htmlPorter from './plugins/htmlPorter'

export default <UserConfig>{
  esbuildTarget: 'es6',
  plugins: [
    vue(),
    vueJsx(),
    vitePluginString(),
    htmlPorter([
      {
        /* 将 </title> 到 </head> 之间的内容移至 </body> 之前 */
        range: {
          start: '</title>\r\n',
          end: '</head>',
        },
        target: '</body>',
        type: 'pre',
      },
    ]),
  ],
  optimizeDeps: {
    include: ['photoswipe/dist/photoswipe-ui-default'],
  },
}
