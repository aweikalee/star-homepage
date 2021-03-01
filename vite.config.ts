import { UserConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vitePluginString from 'vite-plugin-string'

export default <UserConfig>{
  esbuildTarget: 'es6',
  plugins: [vue(), vueJsx(), vitePluginString()],
  optimizeDeps: {
    include: ['photoswipe/dist/photoswipe-ui-default'],
  },
}
