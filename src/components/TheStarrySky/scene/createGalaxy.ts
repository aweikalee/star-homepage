import { Mesh, OGLRenderingContext, Program, Sphere } from 'ogl-typescript'
import { createTextureGalaxy } from '../../../webgl/texture/createTextureGalaxy'
import vertex from '../../../webgl/object/sphere.vert'
import fragment from '../../../webgl/object/sphere.frag'

export async function createGalaxy(gl: OGLRenderingContext) {
  const geometry = new Sphere(gl, { radius: 100, widthSegments: 32 })

  const texture = createTextureGalaxy(gl)

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      tMap: { value: texture },
    },

    // Need inside of sphere to be visible
    cullFace: false,
  })

  const mesh = new Mesh(gl, { geometry, program })
  mesh.rotation.x = -0.2
  mesh.rotation.z = -0.2

  return [mesh]
}
