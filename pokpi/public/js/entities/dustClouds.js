/**
 * Dust Clouds Entity
 * Creates visible dust clouds in space
 */
import * as THREE from 'three';

export const createDustClouds = (engine) => {
  // Custom vertex shader for dust clouds
  const dustVertexShader = `
    uniform float time;
    attribute float size;
    attribute vec3 color;
    varying vec3 vColor;
    
    void main() {
      vColor = color;
      
      // Animate dust particles
      vec3 pos = position;
      pos.x += sin(time * 0.1 + position.z * 0.05) * 5.0;
      pos.y += cos(time * 0.15 + position.x * 0.05) * 5.0;
      pos.z += sin(time * 0.08 + position.y * 0.05) * 5.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = size * (300.0 / -mvPosition.z);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  // Custom fragment shader for dust clouds
  const dustFragmentShader = `
    varying vec3 vColor;
    
    void main() {
      // Create circular particles with soft edges
      float r = 0.5 * length(gl_PointCoord - vec2(0.5, 0.5));
      float alpha = 1.0 - smoothstep(0.3, 0.5, r);
      
      gl_FragColor = vec4(vColor, alpha * 0.6); // Increased opacity
    }
  `;
  
  // Create dust cloud geometry
  const dustGeometry = new THREE.BufferGeometry();
  const dustCount = 10000;
  
  // Create positions for dust particles
  const positions = new Float32Array(dustCount * 3);
  const colors = new Float32Array(dustCount * 3);
  const sizes = new Float32Array(dustCount);
  
  // Generate dust particles in a large volume
  for (let i = 0; i < dustCount; i++) {
    // Position dust in a large spherical volume
    const radius = 2000 + Math.random() * 3000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Vary colors slightly for visual interest
    const colorBase = 0.5 + Math.random() * 0.5; // Brighter colors
    colors[i * 3] = colorBase * (0.7 + Math.random() * 0.3);
    colors[i * 3 + 1] = colorBase * (0.7 + Math.random() * 0.3);
    colors[i * 3 + 2] = colorBase * (0.8 + Math.random() * 0.2);
    
    // Vary sizes for depth perception
    sizes[i] = 2.0 + Math.random() * 8.0; // Larger particles
  }
  
  // Set attributes
  dustGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  dustGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  dustGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  
  // Create material
  const dustMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: dustVertexShader,
    fragmentShader: dustFragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create points system
  const dustClouds = new THREE.Points(dustGeometry, dustMaterial);
  
  // Add update method
  dustClouds.update = (deltaTime) => {
    dustClouds.material.uniforms.time.value += deltaTime;
  };
  
  return dustClouds;
};
