import { Transform, OGLRenderingContext } from 'ogl-typescript'
import { createConstellations } from './createConstellations'

export function createScene(gl: OGLRenderingContext) {
  const scene = new Transform()
  createObject(gl, scene)

  return scene
}

async function createObject(gl: OGLRenderingContext, scene: Transform) {
  ;(await createConstellations(gl)).map((v) => v.setParent(scene))
}
