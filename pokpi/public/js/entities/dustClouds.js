/**
 * Dust Clouds Entity
 * Creates procedural dust clouds with custom shaders
 */
import * as THREE from 'three';

export const createDustClouds = (engine) => {
  // Custom dust cloud vertex shader
  const dustVertexShader = `
    attribute float size;
    attribute vec3 customColor;
    uniform float time;
    varying vec3 vColor;
    
    void main() {
      vColor = customColor;
      
      // Slow drift motion
      vec3 pos = position;
      pos.x += sin(time * 0.1 + position.z * 0.01) * 5.0;
      pos.y += cos(time * 0.1 + position.x * 0.01) * 5.0;
      pos.z += sin(time * 0.1 + position.y * 0.01) * 5.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (100.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  // Custom dust cloud fragment shader
  const dustFragmentShader = `
    varying vec3 vColor;
    
    void main() {
      float r = distance(gl_PointCoord, vec2(0.5, 0.5));
      if (r > 0.5) discard;
      
      // Soft particles
      float opacity = 0.3 * (1.0 - r * 2.0);
      gl_FragColor = vec4(vColor, opacity);
    }
  `;
  
  // Create geometry
  const dustCount = 20000;
  const dustGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(dustCount * 3);
  const colors = new Float32Array(dustCount * 3);
  const sizes = new Float32Array(dustCount);
  
  // Generate random dust particles
  for (let i = 0; i < dustCount; i++) {
    // Position in a large sphere
    const radius = 500 + Math.random() * 2500;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Dust color (subtle blues and whites)
    const intensity = 0.3 + Math.random() * 0.2;
    colors[i * 3] = intensity;
    colors[i * 3 + 1] = intensity;
    colors[i * 3 + 2] = intensity + Math.random() * 0.2;
    
    // Dust size
    sizes[i] = 1 + Math.random() * 4;
  }
  
  // Set attributes
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create shader material
  const dustMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: dustVertexShader,
    fragmentShader: dustFragmentShader,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    transparent: true
  });
  
  // Create points
  return new THREE.Points(dustGeometry, dustMaterial);
};
