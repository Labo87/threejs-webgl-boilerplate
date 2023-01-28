varying vec2 vUv;
uniform sampler2D uTexture;
// uniform float uTime;


void main() {
  vec4 texture = texture2D(uTexture, vUv);
  
  gl_FragColor = texture;
  // gl_FragColor = vec4(vUv, 1.0, 1.0);
}