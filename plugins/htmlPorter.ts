import { Plugin } from 'vite'

export interface IHtmlPorterOption {
  range: {
    start: string | RegExp
    end: string | RegExp
  }
  target: string | RegExp
  type: 'pre' | 'post'
}

export default (options: IHtmlPorterOption[]): Plugin => {
  return {
    name: 'html-porter',
    transformIndexHtml(html) {
      options.forEach(({ range, target, type = 'post' }) => {
        const contentRange = getContextRange(html, range)
        const targetRange = getTargetRange(html, target)

        const [start, end] = contentRange
        const index = type === 'pre' ? targetRange[0] : targetRange[1]

        return applyPort(html, {
          start,
          end,
          index,
        })
      })

      return html
    },
  }
}

function getContextRange(html: string, range: IHtmlPorterOption['range']) {
  let match: RegExpMatchArray
  let start = -1
  let end = -1

  match = html.match(range.start)
  if (match) {
    start = match.index + match[0].length
  }

  match = html.match(range.end)
  if (match) {
    end = match.index
  }

  return [start, end]
}

function getTargetRange(html: string, target: IHtmlPorterOption['target']) {
  let match: RegExpMatchArray
  let start = -1
  let end = -1

  match = html.match(target)
  if (match) {
    start = match.index
    end = match.index + match[0].length
  }

  return [start, end]
}

function applyPort(
  html: string,
  { start, end, index }: { start: number; end: number; index: number }
) {
  if (start === -1 || end === -1 || index === -1) return html
  ;[start, end] = [Math.min(start, end), Math.max(start, end)]
  if (index > end) index = index - end + start

  const context = html.slice(start, end)
  const removed = html.slice(0, start).concat(html.slice(end))
  const result = removed.slice(0, index).concat(context, removed.slice(index))

  return result
}
