/**
 * Starfield Entity
 * Creates a procedural starfield with custom shaders
 */
import * as THREE from 'three';

export const createStarfield = (engine) => {
  // Number of stars to render in the starfield
  const starCount = 15000;
  
  // Custom star vertex shader with enhanced brightness and glow
  const starVertexShader = `
    attribute float size;
    attribute vec3 customColor;
    attribute float brightness;
    uniform float time;
    varying vec3 vColor;
    varying float vBrightness;
    varying float vGlow;
    
    void main() {
      vColor = customColor;
      
      // Enhanced brightness factor
      vBrightness = brightness * 1.5;
      
      // Add more pronounced twinkling effect
      float twinkle = sin(time * 3.0 + position.x * 0.5 + position.y * 0.3 + position.z * 0.2) * 0.7 + 0.8;
      
      // Add pulsing glow effect
      float pulse = sin(time * 2.0 + position.y * 0.2) * 0.3 + 0.7;
      vGlow = pulse * twinkle * 1.4;
      
      vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
      
      // Increase size for more visible stars
      gl_PointSize = size * (350.0 / -mvPosition.z) * (0.9 + 0.6 * twinkle);
      gl_Position = projectionMatrix * mvPosition;
    }
  `;
  
  // Custom star fragment shader
  const starFragmentShader = `
    varying vec3 vColor;
    varying float vBrightness;
    varying float vGlow;
    
    void main() {
      // Calculate distance from center of point
      float r = distance(gl_PointCoord, vec2(0.5, 0.5));
      
      // Discard pixels outside the star radius
      if (r > 0.5) discard;
      
      // Enhanced falloff from center to edge with more pronounced core
      float intensity = pow(1.0 - r * 2.0, 1.5);
      
      // Apply color and enhanced brightness
      vec3 finalColor = vColor * intensity * vBrightness * vGlow;
      
      // Add extra glow to the core
      if (r < 0.2) {
        finalColor += vColor * (0.2 - r) * 5.0 * vGlow;
      }
      
      gl_FragColor = vec4(finalColor, intensity);
    }
  `;
  
  // Create geometry
  const starGeometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);
  const colors = new Float32Array(starCount * 3);
  const sizes = new Float32Array(starCount);
  const brightness = new Float32Array(starCount);
  
  // Generate random stars
  for (let i = 0; i < starCount; i++) {
    // Position in a large sphere
    const radius = 500 + Math.random() * 2000;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    
    positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
    positions[i * 3 + 2] = radius * Math.cos(phi);
    
    // Random star color (mostly white/blue with some variation)
    const colorChoice = Math.random();
    if (colorChoice > 0.95) {
      // Red/orange star
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 2] = 0.3 + Math.random() * 0.3;
    } else if (colorChoice > 0.9) {
      // Yellow star
      colors[i * 3] = 1.0;
      colors[i * 3 + 1] = 1.0;
      colors[i * 3 + 2] = 0.7 + Math.random() * 0.3;
    } else if (colorChoice > 0.8) {
      // Blue star
      colors[i * 3] = 0.7 + Math.random() * 0.3;
      colors[i * 3 + 1] = 0.8 + Math.random() * 0.2;
      colors[i * 3 + 2] = 1.0;
    } else {
      // White star with slight blue tint
      const intensity = 0.8 + Math.random() * 0.2;
      colors[i * 3] = intensity;
      colors[i * 3 + 1] = intensity;
      colors[i * 3 + 2] = intensity + Math.random() * 0.2;
    }
    
    // Random star size (some bigger than others)
    if (Math.random() > 0.99) {
      // Very large stars (rare)
      sizes[i] = 7.5 + Math.random() * 10;
      brightness[i] = 1.5 + Math.random() * 0.5;
    } else if (Math.random() > 0.95) {
      // Larger stars
      sizes[i] = 4 + Math.random() * 6;
      brightness[i] = 1.2 + Math.random() * 0.3;
    } else {
      // Normal stars
      sizes[i] = 0.5 + Math.random() * 1.5;
      brightness[i] = 0.8 + Math.random() * 0.4;
    }
  }
  
  // Set attributes
  starGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  starGeometry.setAttribute('customColor', new THREE.BufferAttribute(colors, 3));
  starGeometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));
  starGeometry.setAttribute('brightness', new THREE.BufferAttribute(brightness, 1));
  
  // Create shader material
  const starMaterial = new THREE.ShaderMaterial({
    uniforms: {
      time: { value: 0 }
    },
    vertexShader: starVertexShader,
    fragmentShader: starFragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
  });
  
  // Create points
  const starfield = new THREE.Points(starGeometry, starMaterial);
  
  // Set user data for identification
  starfield.userData = {
    type: 'starfield',
    name: 'Starfield'
  };
  
  return starfield;
}; 