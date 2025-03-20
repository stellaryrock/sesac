/**
 * Stellar Entity
 * Creates an unrealistic, artistic stellar phenomenon with custom shaders
 */
import * as THREE from 'three';

export const createStellarPhenomenon = (engine) => {
  // Custom vertex shader for the stellar phenomenon
  const stellarVertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    uniform float time;
    
    void main() {
      vPosition = position;
      vUv = uv;
      
      // Create undulating motion
      vec3 newPosition = position;
      float displacement = sin(position.x * 0.05 + time) * 
                          cos(position.y * 0.05 + time) * 
                          sin(position.z * 0.05 + time * 0.3) * 15.0;
      
      newPosition += normal * displacement;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;
  
  // Custom fragment shader for the stellar phenomenon
  const stellarFragmentShader = `
    uniform vec3 colorA;
    uniform vec3 colorB;
    uniform vec3 colorC;
    uniform float time;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    
    // Fractal Brownian Motion function
    float fbm(vec3 p) {
      float f = 0.0;
      float amplitude = 0.5;
      float frequency = 0.1;
      
      for (int i = 0; i < 6; i++) {
        float noise = sin(p.x * frequency) * 
                     cos(p.y * frequency) * 
                     sin(p.z * frequency + time * 0.5);
        f += amplitude * noise;
        amplitude *= 0.5;
        frequency *= 2.0;
      }
      
      return f;
    }
    
    void main() {
      // Create complex patterns using position and time
      float pattern1 = fbm(vPosition * 0.01 + vec3(time * 0.1));
      float pattern2 = fbm(vPosition * 0.02 - vec3(time * 0.15));
      
      // Create energy flow effect
      float energy = abs(sin(pattern1 * pattern2 * 3.14159 + time));
      
      // Create color transitions
      vec3 finalColor = mix(colorA, colorB, pattern1 * 0.5 + 0.5);
      finalColor = mix(finalColor, colorC, pattern2 * 0.5 + 0.5);
      
      // Add pulsing glow
      float pulse = 0.5 + 0.5 * sin(time * 0.5);
      finalColor *= 1.0 + pulse * energy * 0.5;
      
      // Add transparency for ethereal effect
      float alpha = 0.7 + 0.3 * energy;
      
      gl_FragColor = vec4(finalColor, alpha);
    }
  `;
  
  // Create a complex geometry for the stellar phenomenon
  const createStellarGeometry = () => {
    // Start with a sphere but make it more interesting
    const baseGeometry = new THREE.IcosahedronGeometry(200, 4);
    
    // Get position data
    const positions = baseGeometry.attributes.position.array;
    
    // Apply distortion to create a more organic shape
    for (let i = 0; i < positions.length; i += 3) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];
      
      // Calculate distance from center
      const distance = Math.sqrt(x * x + y * y + z * z);
      
      // Apply noise-based distortion
      const noise = Math.sin(x * 0.05) * Math.cos(y * 0.05) * Math.sin(z * 0.05);
      const distortionFactor = 1.0 + noise * 0.3;
      
      // Apply distortion
      positions[i] = x * distortionFactor;
      positions[i + 1] = y * distortionFactor;
      positions[i + 2] = z * distortionFactor;
    }
    
    // Update the geometry
    baseGeometry.computeVertexNormals();
    return baseGeometry;
  };
  
  // Generate random vibrant colors
  const generateColors = () => {
    // Choose from a set of vibrant, unrealistic color combinations
    const colorSets = [
      // Cosmic purple/blue/pink
      [new THREE.Color(0.5, 0.0, 1.0), new THREE.Color(0.0, 0.5, 1.0), new THREE.Color(1.0, 0.3, 0.8)],
      // Alien green/yellow/cyan
      [new THREE.Color(0.0, 1.0, 0.5), new THREE.Color(1.0, 1.0, 0.0), new THREE.Color(0.0, 1.0, 1.0)],
      // Fiery orange/red/yellow
      [new THREE.Color(1.0, 0.5, 0.0), new THREE.Color(1.0, 0.0, 0.0), new THREE.Color(1.0, 1.0, 0.0)],
      // Ethereal teal/purple/blue
      [new THREE.Color(0.0, 0.8, 0.8), new THREE.Color(0.8, 0.0, 0.8), new THREE.Color(0.0, 0.0, 1.0)]
    ];
    
    return colorSets[Math.floor(Math.random() * colorSets.length)];
  };
  
  // Create geometry
  const stellarGeometry = createStellarGeometry();
  
  // Get colors
  const [colorA, colorB, colorC] = generateColors();
  
  // Create shader material
  const stellarMaterial = new THREE.ShaderMaterial({
    uniforms: {
      colorA: { value: colorA },
      colorB: { value: colorB },
      colorC: { value: colorC },
      time: { value: 0 }
    },
    vertexShader: stellarVertexShader,
    fragmentShader: stellarFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    blending: THREE.AdditiveBlending
  });
  
  // Create mesh
  const stellarMesh = new THREE.Mesh(stellarGeometry, stellarMaterial);
  
  // Add a point light inside the phenomenon for extra glow
  const light = new THREE.PointLight(colorB, 1.5, 500);
  stellarMesh.add(light);
  
  return stellarMesh;
};
