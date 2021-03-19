import { resizeObserver } from './resizeObserver'

/**
 * Safari 在横屏转竖屏时，resize 无法正确工作
 * 此方法则是通过监听 body 中 fixed 的 DOM 变化
 * 会比 resize 更可靠
 */

class Subscribe {
  list: Function[] = []

  on(callback: Function) {
    const index = this.list.indexOf(callback)
    if (!~index) this.list.push(callback)
  }

  off(callback: Function) {
    const index = this.list.indexOf(callback)
    if (~index) this.list.splice(index, 1)
  }

  emit() {
    this.list.forEach((callback) => callback())
  }
}

let subscribe: Subscribe

export function onBodyResize(callback: Function) {
  if (!subscribe) {
    // 初始化
    subscribe = new Subscribe()
    try {
      const el = createObserverElement()
      resizeObserver(el, () => subscribe.emit())
    } catch (e) {
      addEventListener('resize', () => subscribe.emit())
    }
  }

  subscribe.on(callback)
  return () => subscribe.off(callback)
}

function createObserverElement() {
  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: -99999999
  `
  document.body.appendChild(el)
  return el
}
