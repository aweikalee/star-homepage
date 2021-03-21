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
    url: 'https://blog.maodai.site',
    description:
      '技术博客，没啥文章。大多死于草稿箱（然后丢进了另一个加密的博客中给自己看）',
    // prettier-ignore
    points: [
      -44, -58,
      -57, -25,
      -42,   9,
      -55,  46,
      -13,  26,
        8,  28,
       37,  53,
       42,  14,
       52, -23,
       34, -59,
       0,  10,
       0, -40,
      -18, -39,
       17, -39,
    ],
    // prettier-ignore
    lines: [
      0,  1,
      1,  2,
      2,  3,
      3,  4,
      4,  5,
      5,  6,
      6,  7,
      7,  8,
      8,  9,
     10, 11,
     11, 12,
     11, 13,
    ],
  },
  {
    title: 'JavaScript 抽象相等比较',
    url: 'https://aweikalee.github.io/abstract-equality-comparison/',
    description:
      '展示 JavaScript 抽象相等的比较过程，帮助新人更好理解隐式转换。',
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

/* 关于我 */
// prettier-ignore
export const jojo = [
  /* 乔纳森 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
     -1,  52,
      2,  20,
     -8,   0,
    -43,  -8,
    -23,  18,
    -16,  50,
     16,  45,
     -9,  20,
      0,  62,
    -37, -93,
    -32, -39,
    -17,   3,
      4,  -4,
     22, -43,
     45, -93,
  ],
  /* 乔瑟夫 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
      0,  50,
     -7,  29,
     -6,   2,
     12,  93,
    -29,  74,
    -18,  46,
     15,  44,
     28,  74,
    -13,  91,
    -20, -86,
    -41, -36,
    -19,  -1,
      8,   6,
     17, -37,
     14, -93,
  ],
  /* 承太郎 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
     -1,  51,
     -3,  18,
      0,  -1,
    -32,  52,
    -29,  20,
    -17,  49,
     14,  42,
     10,  16,
     20, -15,
    -36, -96,
    -19, -50,
    -13,  -5,
     10,  -2,
     26, -47,
     36, -95,
  ],
  /* 仗助 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
     -1,  51,
     -9,  21,
     -2,   3,
    -16,  89,
    -53,  60,
    -16,  46,
     16,  44,
     52,  37,
      3,  32,
    -14, -93,
    -22, -39,
    -15,   0,
     10,   5,
     19, -38,
     31, -93,
  ],
  /* 乔鲁诺 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
     -1,  51,
      1,  28,
     -8,   1,
    -13,  34,
    -42,  33,
    -16,  47,
     15,  47,
     21,  20,
      8, -11,
    -49, -92,
    -37, -41,
    -23,  -1,
      4,   4,
     35, -37,
     26, -92,
  ],
  /* 徐伦 */
  [
    -15,  83,
    -15,  53,
     15,  53,
     15,  83,
     -1,  51,
     -1,  26,
     -7,   2,
     16,  10,
    -16,  16,
    -17,  47,
     17,  43,
      6,  13,
      6,  54,
     18, -83,
    -25, -38,
    -18,   2,
     11,   0,
      9, -41,
      3, -91,
  ]
]

sites.push({
  title: '关于我',
  url: '',
  description: (
    <>
      <div>我是毛呆, 一个接触前端很久但只有一年工作经验的前端工程师。</div>
      <div>
        目前正在<strong>求职中</strong>，对我感兴趣的话可以联系我，
        <a href="mailto:aweikalee@163.com">aweikalee@163.com</a>。
      </div>
    </>
  ),
  points: jojo[Math.floor(Math.random() * jojo.length)],
  // prettier-ignore
  lines: [
      0,  1,
      1,  2,
      2,  3,
      0,  3,
      4,  5,
      5,  6,
      7,  8,
      8,  9,
      9, 10,
     10, 11,
     11, 12,
     13, 14,
     14, 15,
     15, 16,
     16, 17,
     17, 18,
    ],
})

/* 为空 lines 填充数据 */
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
