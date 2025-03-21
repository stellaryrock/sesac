/**
 * Splender Entity
 * Creates a spectacular cosmic phenomenon with physics interaction
 */
import * as THREE from 'three';

export const createSplender = (engine) => {
  // Custom vertex shader for the splender
  const splenderVertexShader = `
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    uniform float time;
    
    void main() {
      vPosition = position;
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      
      // Create pulsating effect
      float pulse = sin(time * 0.5) * 0.05 + 1.0;
      vec3 newPosition = position * pulse;
      
      gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
    }
  `;
  
  // Custom fragment shader for the splender
  const splenderFragmentShader = `
    uniform vec3 baseColor;
    uniform vec3 glowColor;
    uniform float time;
    
    varying vec3 vPosition;
    varying vec2 vUv;
    varying vec3 vNormal;
    
    // Noise function
    float hash(float n) { return fract(sin(n) * 43758.5453123); }
    
    float noise(vec3 x) {
      vec3 p = floor(x);
      vec3 f = fract(x);
      f = f * f * (3.0 - 2.0 * f);
      
      float n = p.x + p.y * 157.0 + 113.0 * p.z;
      return mix(
        mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
            mix(hash(n + 157.0), hash(n + 158.0), f.x), f.y),
        mix(mix(hash(n + 113.0), hash(n + 114.0), f.x),
            mix(hash(n + 270.0), hash(n + 271.0), f.x), f.y), f.z);
    }
    
    void main() {
      // Create energy flow patterns
      float noiseScale = 2.0;
      float noiseTime = time * 0.2;
      float noiseValue = noise(vec3(vUv * noiseScale, noiseTime));
      
      // Create edge glow effect
      float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 3.0);
      
      // Combine effects
      vec3 color = mix(baseColor, glowColor, noiseValue * 0.6 + edgeGlow);
      
      // Add pulsating brightness
      float pulse = 0.8 + 0.2 * sin(time * 2.0 + noiseValue * 5.0);
      color *= pulse;
      
      // Add transparency at edges
      float alpha = 0.7 + 0.3 * noiseValue - edgeGlow * 0.3;
      
      gl_FragColor = vec4(color, alpha);
    }
  `;
  
  // Create a complex geometry
  const splenderGeometry = new THREE.TorusKnotGeometry(75, 20, 128, 32, 2, 3);
  
  // Choose vibrant colors
  const baseColor = new THREE.Color(0.2, 0.5, 1.0); // Deep blue
  const glowColor = new THREE.Color(0.5, 0.8, 1.0); // Light blue
  
  // Create shader material
  const splenderMaterial = new THREE.ShaderMaterial({
    uniforms: {
      baseColor: { value: baseColor },
      glowColor: { value: glowColor },
      time: { value: 0 }
    },
    vertexShader: splenderVertexShader,
    fragmentShader: splenderFragmentShader,
    transparent: true,
    side: THREE.DoubleSide,
    depthWrite: false,
    blending: THREE.AdditiveBlending
  });
  
  // Create mesh
  const splenderMesh = new THREE.Mesh(splenderGeometry, splenderMaterial);
  
  // Position in space
  splenderMesh.position.set(400, 100, -600);
  
  // Add physics properties if physics system exists
  if (engine.getSystem('physics')) {
    const physicsSystem = engine.getSystem('physics');
    
    // Register with physics system
    physicsSystem.registerObject(splenderMesh);
    
    // Set physics properties
    splenderMesh.physics.mass = 2500;
    splenderMesh.physics.collisionRadius = 100;
    splenderMesh.physics.velocity = new THREE.Vector3(0, 0.5, 0);
    
    // Add orbital particles that are affected by gravity
    const particleCount = 50;
    const particles = [];
    
    for (let i = 0; i < particleCount; i++) {
      // Create small glowing sphere
      const particleGeometry = new THREE.SphereGeometry(5 + Math.random() * 10, 16, 16);
      const particleMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color(
          0.5 + Math.random() * 0.5,
          0.5 + Math.random() * 0.5,
          0.5 + Math.random() * 0.5
        ),
        transparent: true,
        opacity: 0.7
      });
      
      const particle = new THREE.Mesh(particleGeometry, particleMaterial);
      
      // Position around the splender
      const angle = Math.random() * Math.PI * 2;
      const radius = 110 + Math.random() * 50;
      particle.position.set(
        splenderMesh.position.x + Math.cos(angle) * radius,
        splenderMesh.position.y + (Math.random() - 0.5) * 100,
        splenderMesh.position.z + Math.sin(angle) * radius
      );
      
      // Register with physics system
      physicsSystem.registerObject(particle);
      
      // Set physics properties
      particle.physics.mass = 10;
      particle.physics.collisionRadius = 10;
      
      // Set initial velocity for orbit (perpendicular to radius)
      const speed = 2 + Math.random() * 2;
      particle.physics.velocity = new THREE.Vector3(
        -Math.sin(angle) * speed,
        (Math.random() - 0.5) * 0.5,
        Math.cos(angle) * speed
      );
      
      // Add to scene and track
      engine.scene.add(particle);
      particles.push(particle);
    }
    
    // Store particles reference
    splenderMesh.particles = particles;
  }
  
  // Add a point light
  const light = new THREE.PointLight(glowColor, 2, 1000);
  splenderMesh.add(light);
  
  // Set user data for identification
  splenderMesh.userData = {
    type: 'splender',
    name: 'Cosmic Splender',
    description: 'A rare and beautiful cosmic phenomenon'
  };
  
  return splenderMesh;
};
