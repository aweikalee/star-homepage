attribute vec3 position;
attribute vec3 color;
attribute float opacity;
attribute float random;
attribute float size;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform vec2 viewport;

uniform float uHeight;

varying vec4 vColor;
varying float vRandom;

void main() {
  vColor = vec4(color, opacity);
  vRandom = random;

  float scale = viewport.y * projectionMatrix[1][1] / 900.0;

  gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
  gl_PointSize = size * scale / length(gl_Position);
}
