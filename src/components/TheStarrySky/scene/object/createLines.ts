import { Program, Geometry, Mesh, OGLRenderingContext } from 'ogl-typescript'
import vertex from './lines.vert'
import fragment from './lines.frag'

export interface IParticlesAttributes {
  positions: ArrayLike<number>
  color: number[]
  opacity: number
}

export function createLines(
  gl: OGLRenderingContext,
  attributes: IParticlesAttributes
) {
  const { positions, color, opacity } = attributes

  const geometry = new Geometry(gl, {
    position: { size: 3, data: positions },
  })

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uColor: {
        value: [...color, opacity],
      },
    },
    transparent: true,
    depthTest: false,
  })

  const mesh = new Mesh(gl, {
    mode: gl.LINES,
    geometry,
    program,
  })

  return mesh
}
