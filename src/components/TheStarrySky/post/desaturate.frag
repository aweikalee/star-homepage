precision highp float;
uniform sampler2D tMap;
varying vec2 vUv;
void main() {
  vec3 tex = texture2D(tMap, vUv).rgb;
  float r = tex.r;
  float g = tex.g;
  float b = tex.b;

  float cMin = min(min(r, g), b);
  float cMax = max(max(r, g), b);
  float cAverage = (r + g + b) / 3.0;
  tex = vec3((cMin + cMax + cAverage) / 3.0);

  gl_FragColor.rgb = tex;
  gl_FragColor.a = 1.0;
}