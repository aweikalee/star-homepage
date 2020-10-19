attribute vec3 position;
attribute vec3 color;
attribute float opacity;
attribute float size;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;

uniform float uHeight;

varying vec4 vColor;

void main() {
  vColor = vec4(color, opacity);

  float scale = uHeight * projectionMatrix[1][1] / 900.0;

  gl_Position = projectionMatrix * modelViewMatrix  * vec4(position, 1.0);
  gl_PointSize = size * scale / length(gl_Position);
}
