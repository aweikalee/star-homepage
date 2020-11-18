import { UserConfig } from 'vite'
import glsl from './build/vitePluginGlsl'

export default <UserConfig>{
  base: '.',
  esbuildTarget: 'es6',
  plugins: [glsl],
  optimizeDeps: {
    include: ['photoswipe/dist/photoswipe-ui-default'],
  },
}
