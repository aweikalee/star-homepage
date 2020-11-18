import { computed, defineComponent, onMounted, reactive, ref } from 'vue'
import { ISite, sites } from '../src/config'
import Constellation from '../src/components/Constellation'

import './App.scss'

const previewSzie = 600
const scale = previewSzie / 200
export default defineComponent(() => {
  const el = ref<HTMLElement>()
  const text = reactive({
    points: '',
    lines: '',
    background: '',
  })

  const points = computed(() => parse(text.points))
  const lines = computed(() => parse(text.lines))
  const pointsGroup = computed(() => {
    const res: [number, number][] = []
    const p = points.value
    for (let i = 0; i < p.length; i += 2) {
      const point = transformPoint([p[i], p[i + 1]])
      res.push(point)
    }
    return res
  })

  /* 使用 site 的数据 */
  const useSite = (site: { points: number[]; lines: number[] }) => {
    text.points = format(site.points, 2)
    text.lines = format(site.lines, 2)
  }

  /* 加载数据 */
  onMounted(() => useSite(sites[0]))

  /* 点击事件 添加数据 */
  const addPoint = (e: MouseEvent) => {
    const rect = el.value.getBoundingClientRect()
    let x = e.clientX - rect.x
    let y = e.clientY - rect.y

    /* 改变坐标中心 */
    x -= previewSzie / 2
    y -= previewSzie / 2

    /* 反转 y轴 */
    y = -y

    /* 改变比例 */
    x /= scale
    y /= scale

    /* 取整 */
    x = Math.floor(x)
    y = Math.floor(y)

    const arr = [...points.value]
    if (arr.length % 2) arr.push(0)
    arr.push(x, y)
    text.points = format(arr, 2)
  }

  /* 加载参考图片 */
  const onFileChange = (e: Event) => {
    const target = e.target as HTMLInputElement
    if (target.files) {
      const file = target.files[0]
      text.background = URL.createObjectURL(file)
    } else {
      text.background = ''
    }
  }

  return () => {
    return (
      <>
        <div class="list">
          <ol>
            {sites.map((site) => (
              <li onClick={() => useSite(site as ISite)}>{site.title}</li>
            ))}
          </ol>
        </div>

        <div
          ref={el}
          class="svg"
          style={{
            width: `${previewSzie}px`,
            height: `${previewSzie}px`,
            backgroundImage: text.background
              ? `url(${text.background})`
              : undefined,
          }}
          onClick={addPoint}
        >
          <Constellation points={points.value} lines={lines.value} />

          {pointsGroup.value.map(([x, y], index) => {
            const translateX = `calc(${x * scale}px - 50%)`
            const translateY = `calc(${y * scale}px - 50%)`
            return (
              <span
                style={{
                  transform: `translate(${translateX}, ${translateY})`,
                }}
              >
                {index}
              </span>
            )
          })}
        </div>

        <div>
          <label>
            参考图片：
            <input type="file" onChange={onFileChange} />
          </label>
        </div>

        <div class="textarea">
          <textarea
            value={text.points}
            placeholder="points"
            onChange={(e) => {
              text.points = (e.target as HTMLTextAreaElement).value
            }}
          ></textarea>
          <textarea
            value={text.lines}
            placeholder="lines"
            onChange={(e) => {
              text.lines = (e.target as HTMLTextAreaElement).value
            }}
          ></textarea>
        </div>
        <div>
          <button
            onClick={() => {
              text.points = format(text.points, 2)
              text.lines = format(text.lines, 2)
            }}
          >
            格式化
          </button>
          <button
            onClick={() => {
              text.points = ''
              text.lines = ''
            }}
          >
            清空
          </button>
          <button
            onClick={() => {
              text.points = format(
                points.value.map((v) => {
                  return Math.floor(v)
                }),
                2
              )
            }}
          >
            取整(points)
          </button>
        </div>
      </>
    )
  }
})

function parse(text: string) {
  return text
    .split(',')
    .filter((v) => v.trim())
    .map((v) => Number(v))
}

function format(value: string | number[], size: number) {
  const arr = Array.isArray(value) ? value : parse(value)
  const indents: number[] = Array.from(new Array(size), () => 0)

  return arr
    .map((v, i) => {
      const str = v.toString()
      const len = str.length
      const index = i % size
      indents[index] = Math.max(indents[index], len)
      return str
    })
    .reduce((prev, cur, i, arr) => {
      const indent = Array.from(
        new Array(indents[i % size] - cur.length),
        () => ' '
      ).join('')

      const space = i > 0 && (i + 1) % size === 0 ? '\n' : ' '

      return `${prev}${indent}${cur},${space}`
    }, '')
}

function transformPoint([x, y]: [number, number]): [number, number] {
  return [x, -y]
}
