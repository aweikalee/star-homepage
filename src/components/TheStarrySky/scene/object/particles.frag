precision mediump float;

uniform sampler2D uTexture;

varying vec4 vColor;

void main() {
  gl_FragColor = vColor * texture2D(uTexture, gl_PointCoord);
}