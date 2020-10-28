let isDrag = false
function onDragstart(e: Event) {
  isDrag = true
  e.preventDefault()
}
function onClick(e: Event) {
  if (isDrag) e.preventDefault()
  isDrag = false
}
function onTouchStart(e: Event) {
  e.stopPropagation()
}

export const preventOrbit = {
  onDragstart,
  onClick,
  onTouchStart,
}
