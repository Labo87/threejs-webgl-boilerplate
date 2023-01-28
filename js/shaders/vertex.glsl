varying vec2 vUv;
// uniform vec2 uAspectRatio;


void main() {
  // vUv = (uv - vec2(0.5)) * uAspectRatio + vec2(0.5);
  vUv = uv;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(position.xyz, 1.0);
}