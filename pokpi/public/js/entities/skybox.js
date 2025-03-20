/**
 * Skybox Entity
 * Creates a procedural space skybox with custom shaders
 */
import * as THREE from 'three';

export const createSkybox = (engine) => {
  // Skybox vertex shader
  const skyboxVertexShader = `
    varying vec3 vWorldPosition;
    
    void main() {
      vec4 worldPosition = modelMatrix * vec4(position, 1.0);
      vWorldPosition = worldPosition.xyz;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Skybox fragment shader
  const skyboxFragmentShader = `
    uniform vec3 topColor;
    uniform vec3 bottomColor;
    uniform float offset;
    uniform float exponent;
    
    varying vec3 vWorldPosition;
    
    void main() {
      float h = normalize(vWorldPosition + offset).y;
      gl_FragColor = vec4(mix(bottomColor, topColor, max(pow(max(h, 0.0), exponent), 0.0)), 1.0);
    }
  `;
  
  // Create a large sphere for the skybox
  const skyGeometry = new THREE.SphereGeometry(5000, 32, 32);
  skyGeometry.scale(-1, 1, 1); // Invert the sphere
  
  // Create shader material
  const skyMaterial = new THREE.ShaderMaterial({
    uniforms: {
      topColor: { value: new THREE.Color(0x0a0a2a) },
      bottomColor: { value: new THREE.Color(0x000000) },
      offset: { value: 400 },
      exponent: { value: 0.6 }
    },
    vertexShader: skyboxVertexShader,
    fragmentShader: skyboxFragmentShader,
    side: THREE.BackSide
  });
  
  // Create mesh
  return new THREE.Mesh(skyGeometry, skyMaterial);
};
