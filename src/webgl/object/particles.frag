precision mediump float;

uniform sampler2D uTexture;

varying vec4 vColor;
varying float vRandom;

void main() {
  vec2 coord = gl_PointCoord - 0.5;
  float random = vRandom * 3.14;
  float cosr = cos(random);
  float sinr = sin(random);
  mat2 rmat = mat2(cosr, -sinr, sinr, cosr);

  gl_FragColor = vColor * texture2D(uTexture, coord * rmat + 0.5);
}