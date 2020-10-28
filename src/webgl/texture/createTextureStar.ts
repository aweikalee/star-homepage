import { OGLRenderingContext, Texture } from 'ogl-typescript'
import textureStar from './texture-star.png'

let texture: Texture
export function createTextureStar(gl: OGLRenderingContext) {
  if (!texture) {
    texture = new Texture(gl)
    const image = new Image()
    image.onload = () => (texture.image = image)
    image.src = textureStar
  }
  return texture
}
