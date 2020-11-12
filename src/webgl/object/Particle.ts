import { Mesh, DrawOptions } from 'ogl-typescript'

const draw = Mesh.prototype.draw

export class Particle extends Mesh {
  draw(drawOptions: Partial<DrawOptions> = {}) {
    const [x, y, width, height] = this.gl.getParameter(this.gl.VIEWPORT)
    this.program.uniforms.viewport = {
      value: [width, height],
    }

    draw.call(this, drawOptions)
  }
}
