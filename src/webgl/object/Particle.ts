import { Mesh, DrawOptions } from 'ogl-typescript'

const draw = Mesh.prototype.draw

export class Particle extends Mesh {
  draw(drawOptions: Partial<DrawOptions> = {}) {
    const viewport = this.gl.renderer.state.viewport
    const width = viewport?.width ?? 1000
    const height = viewport?.height ?? 1000

    this.program.uniforms.viewport = {
      value: [width, height],
    }

    draw.call(this, drawOptions)
  }
}
