;(function () {
  var duration = 500
  var minLoadingTime = 300
  var startTime = Date.now()

  var removed = false
  var el = document.getElementById('loading')
  if (el) {
    el.style.backgroundColor = '#282c34'
    el.style.position = 'fixed'
    el.style.top = '0'
    el.style.bottom = '0'
    el.style.left = '0'
    el.style.right = '0'
    el.style.zIndex = '100000'
    el.style.transition = 'opacity ' + duration + 'ms'
    el.style.opacity = '0'
    el.style.display = null
    setTimeout(function () {
      if (el) {
        el.style.opacity = '1'
      }
    }, minLoadingTime)
  }

  window.$removeLoading = function () {
    if (removed || !el) {
      return
    }
    removed = false
    el.style.opacity = '0'
    var delay = Date.now() - startTime < minLoadingTime ? 0 : duration
    setTimeout(function () {
      el.parentElement.removeChild(el)
      el = null
    }, delay)
  }
})()
