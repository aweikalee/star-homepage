import { UserConfig } from 'vite'
import vitePluginString from 'vite-plugin-string'

export default <UserConfig>{
  esbuildTarget: 'es6',
  plugins: [vitePluginString()],
  optimizeDeps: {
    include: ['photoswipe/dist/photoswipe-ui-default'],
  },
}
