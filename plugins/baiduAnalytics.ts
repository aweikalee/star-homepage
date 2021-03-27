import { Plugin } from 'vite'

export default (token: string): Plugin => {
  return {
    name: 'baidu-analytics',
    apply: 'build',
    transformIndexHtml() {
      return [
        {
          tag: 'script',
          attrs: {
            src: `//hm.baidu.com/hm.js?${token}`,
          },
          injectTo: 'body',
        },
      ]
    },
  }
}
