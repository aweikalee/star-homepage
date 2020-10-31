/**
 * 文件格式参考 https://zh.wikipedia.org/zh-hans/BMP
 */

export interface IBMPData {
  data: Uint8Array
  width: number
  height: number
}

export function createBMP({ data, width, height }: IBMPData) {
  /* 数据块 */
  const theData = createData({ data, width, height })

  /* 文件头 */
  const theHeader = createHeader({
    fileSize: theData.length + 14 + 40,
  })

  /* DIB （结构：BITMAPINFOHEADER） */
  const theDIB = createDIB({ width, height })

  const blobParts = [theHeader, theDIB, theData].map((v) => v.buffer)

  const blob = new Blob(blobParts, {
    type: 'image/bmp',
  })

  return blob
}

/**
 * 文件头
 */
function createHeader({ fileSize }: { fileSize: number }) {
  const header = new Uint8Array(14)

  header.set([66, 77], 0) // 识别签名
  writeInt32(header, 2, fileSize) // 文件大小
  writeInt32(header, 6, 0) // 保留
  writeInt32(header, 10, 14 + 40) // 位图数据 起始位置

  return header
}

/**
 * DIB
 * 结构：BITMAPINFOHEADER
 */
function createDIB({ width, height }: { width: number; height: number }) {
  const dib = new Uint8Array(40)

  writeInt32(dib, 0, 40) // dib 大小
  writeInt32(dib, 4, width) // 位图宽度
  writeInt32(dib, 8, height) // 位图高度
  writeInt16(dib, 12, 1) // 色彩平面数
  writeInt16(dib, 14, 24) // 色位
  writeInt32(dib, 16, 0) // 压缩方法
  writeInt32(dib, 20, 0) // 原始位图数据的大小
  writeInt32(dib, 24, 0) // 图像的横向分辨率
  writeInt32(dib, 28, 0) // 图像的纵向分辨率
  writeInt32(dib, 32, 0) // 调色板的颜色数
  writeInt32(dib, 36, 0) // 重要颜色数

  return dib
}

/**
 * 数据块
 */
function createData({
  data,
  width,
  height,
}: {
  data: Uint8Array
  width: number
  height: number
}) {
  const bit = 24
  const rowSize = ((width * bit + 31) & ~31) / 8
  const buffer = new Uint8Array(rowSize * height)

  /* 对齐 4字节，并将 rgb 转为 bgr */
  const dataSize = width * (bit / 8)
  const tailSize = rowSize - dataSize
  let index = 0
  let offset = 0
  for (let row = 0; row < height; row += 1) {
    for (let i = 0; i < width; i += 1) {
      buffer[offset] = data[index + 2]
      buffer[offset + 1] = data[index + 1]
      buffer[offset + 2] = data[index]
      index += 3
      offset += 3
    }

    offset += tailSize
  }

  return buffer
}

function writeInt16(arr: Uint8Array, index: number, value: number) {
  const values = [value, value >>> 8]
  arr.set(values, index)
}

function writeInt32(arr: Uint8Array, index: number, value: number) {
  const values = [value, value >>> 8, value >>> 16, value >>> 24]
  arr.set(values, index)
}
