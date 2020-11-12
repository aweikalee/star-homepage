precision highp float;
uniform sampler2D tMap;
uniform vec3 uBalance;
varying vec2 vUv;
void main() {
  vec3 tex = texture2D(tMap, vUv).rgb;
  gl_FragColor.rgb = tex * uBalance;
  gl_FragColor.a = 1.0;
}