export interface ISite {
  title: string
  url: string
  description: JSX.Element
  points: number[]
  lines: number[]
}

export const sites: ISite[] = [
  {
    title: '毛呆账簿',
    url: 'https://ledger.maodai.site',
    description:
      '自用记账工具，目前只做了基础功能，扩展的功能以后需要用的时候再慢慢加。',
    // prettier-ignore
    points: [
      -46,  75,
      -46, -75,
       44, -75,
       46,  74,
      -14,  84,
      -68,  27,
       22,  93,
      -86, -15,
       15,  61,
      -52,  -7,
      -23,  74,
      -23,  48,
      -23,  22,
      -23, -51,
        7, -22,
       33, -22,
       20, -36,
       20, -66,
        5, -36,
       35, -36,
        5, -51,
       35, -51,
    ],
    // prettier-ignore
    lines: [
      3,  0,
      0,  1,
      1,  2,
      2,  3,
      4,  5,
      6,  7,
      8,  9,
     10, 11,
     11, 12,
     12, 13,
     14, 16,
     15, 16,
     16, 17,
     18, 19,
     20, 21,
    ],
  },
  {
    title: '旅游手账',
    url: 'https://awwwk.com',
    description:
      '行程制作及展示。针对制作行程单以及旅游过程中的诸多痛点进行了改善。',
    // prettier-ignore
    points: [
      -46,  75,
      -46, -75,
       44, -75,
       46,  74,
      -14,  84,
      -68,  27,
       22,  93,
      -86, -15,
       15,  61,
      -52,  -7,
      -23,  74,
      -23,  48,
      -23,  22,
      -23, -51,
       20, -23,
        5, -61,
       20, -50,
       35, -61,
    ],
    // prettier-ignore
    lines: [
      3,  0,
      0,  1,
      1,  2,
      2,  3,
      4,  5,
      6,  7,
      8,  9,
     10, 11,
     11, 12,
     12, 13,
     14, 15,
     15, 16,
     16, 17,
     17, 14,
    ],
  },
  {
    title: "毛呆's Blog",
    url: 'https://aweikalee.github.io',
    description:
      '技术博客，没啥文章。大多死于草稿箱（然后丢进了另一个加密的博客中给自己看）',
    // prettier-ignore
    points: [
      -46,  75,
      -46, -75,
       44, -75,
       46,  74,
      -14,  84,
      -68,  27,
       22,  93,
      -86, -15,
       15,  61,
      -52,  -7,
      -23,  74,
      -23,  48,
      -23,  22,
      -23, -51,
       10, -25,
       10, -45,
       10, -65,
       30, -25,
       35, -35,
       30, -45,
       35, -55,
       30, -65,
    ],
    // prettier-ignore
    lines: [
      3,  0,
      0,  1,
      1,  2,
      2,  3,
      4,  5,
      6,  7,
      8,  9,
     10, 11,
     11, 12,
     12, 13,
     14, 15,
     15, 16,
     14, 17,
     17, 18,
     18, 19,
     19, 15,
     19, 20,
     20, 21,
     21, 16,
    ],
  },
  {
    title: 'JavaScript 抽象相等比较',
    url: 'https://aweikalee.github.io/abstract-equality-comparison/',
    description: '展示 JavaScript 抽象相等的比较过程，帮助新人更好理解隐式转换。',
    // prettier-ignore
    points: [
      -25,  80,
      -28, -14,
      -68, -15,
      -84,  18,
       74,  69,
       44,  87,
       19,  57,
       74,  15,
       55, -19,
       16,  -1,
      -80, -45,
      -22, -45,
      -80, -75,
      -22, -75,
       80, -45,
       22, -45,
       80, -75,
       22, -75,
    ],
    // prettier-ignore
    lines: [
      0,  1,
      1,  2,
      2,  3,
      4,  5,
      5,  6,
      6,  7,
      7,  8,
      8,  9,
     10, 11,
     12, 13,
     14, 15,
     16, 17,
    ],
  },
  {
    title: 'Github',
    url: 'https://github.com/aweikalee',
    description: 'aweikalee',
    // prettier-ignore
    points: [
      -52,  59,
      -26,  49,
       25,  47,
       53,  61,
       55,  34,
       62, -13,
       18, -44,
       26, -94,
       84, -55,
       89,  46,
       36,  92,
      -58,  82,
      -94,  35,
      -91, -58,
      -29, -94,
      -26, -73,
      -55, -67,
      -74, -43,
      -48, -55,
      -25, -58,
      -17, -45,
      -61,  -9,
      -53,  34,
    ],
    lines: [],
  },
]

/* 为空 liens 填充数据 */
sites.map((site) => {
  const { lines, points } = site
  if (lines.length === 0) {
    const len = Math.floor(points.length / 2)
    for (let i = 0; i < len; i += 1) {
      lines.push(i === 0 ? len - 1 : i - 1)
      lines.push(i)
    }
  }
})
