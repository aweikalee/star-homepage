export interface ISite {
  title: string
  url: string
  points: number[]
  lines: number[]
}

export const sites: ISite[] = [
  {
    title: '毛呆账簿',
    url: 'https://ledger.maodai.site',
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
        -23, -51
    ],
    // prettier-ignore
    lines: [
        3, 0,
        0, 1,
        1, 2,
        2, 3,
        4, 5,
        6, 7,
        8, 9,
        10, 11,
        11, 12,
        12, 13
    ],
  },
  {
    title: 'Github',
    url: 'https://github.com/aweikalee',
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
        -53,  34
    ],
    lines: [],
  },
]
sites.push(...sites, ...sites)