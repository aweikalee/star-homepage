import { viewport } from './../../../../store/viewport'
import { computed } from 'vue'
import {
  Program,
  Geometry,
  Mesh,
  OGLRenderingContext,
  Texture,
} from 'ogl-typescript'
import vertex from './particles.vert'
import fragment from './particles.frag'

export interface IParticlesAttributes {
  colors: ArrayLike<number>
  opacities: ArrayLike<number>
  positions: ArrayLike<number>
  sizes: ArrayLike<number>
  texture: Texture
}

const uHeight = computed(() => viewport.h)

export function createParticles(
  gl: OGLRenderingContext,
  attributes: IParticlesAttributes
) {
  const { colors, opacities, positions, sizes, texture } = attributes

  const geometry = new Geometry(gl, {
    color: { size: 3, data: colors },
    opacity: { size: 1, data: opacities },
    position: { size: 3, data: positions },
    size: { size: 1, data: sizes },
  })

  const program = new Program(gl, {
    vertex,
    fragment,
    uniforms: {
      uTexture: {
        value: texture,
      },
      uHeight,
    },
    transparent: true,
    depthTest: false,
  })

  const mesh = new Mesh(gl, {
    mode: gl.POINTS,
    geometry,
    program,
  })

  return mesh
}
