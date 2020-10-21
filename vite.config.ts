import { UserConfig } from 'vite'
import glsl from './build/vitePluginGlsl'

export default <UserConfig>{
  esbuildTarget: 'es6',
  plugins: [glsl],
}