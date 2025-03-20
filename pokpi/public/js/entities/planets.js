/**
 * Planets Entity
 * Creates procedural planets with custom shaders
 */
import * as THREE from 'three';

export const createPlanets = (engine) => {
  // Array to hold all planet objects
  const planets = [];
  
  // Planet vertex shader
  const planetVertexShader = `
    varying vec2 vUv;
    varying vec3 vNormal;
    
    void main() {
      vUv = uv;
      vNormal = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;
  
  // Planet fragment shader
  const planetFragmentShader = `
    uniform vec3 baseColor;
    uniform vec3 atmosphereColor;
    uniform float time;
    uniform float glowIntensity;
    uniform float noiseScale;
    uniform float atmosphereIntensity;
    
    varying vec2 vUv;
    varying vec3 vNormal;
    
    // Simplex noise function
    vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
    vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
    vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }
    
    float snoise(vec3 v) {
      const vec2 C = vec2(1.0/6.0, 1.0/3.0);
      const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
      
      // First corner
      vec3 i  = floor(v + dot(v, C.yyy));
      vec3 x0 = v - i + dot(i, C.xxx);
      
      // Other corners
      vec3 g = step(x0.yzx, x0.xyz);
      vec3 l = 1.0 - g;
      vec3 i1 = min(g.xyz, l.zxy);
      vec3 i2 = max(g.xyz, l.zxy);
      
      vec3 x1 = x0 - i1 + C.xxx;
      vec3 x2 = x0 - i2 + C.yyy;
      vec3 x3 = x0 - D.yyy;
      
      // Permutations
      i = mod289(i);
      vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
              + i.y + vec4(0.0, i1.y, i2.y, 1.0))
              + i.x + vec4(0.0, i1.x, i2.x, 1.0));
              
      // Gradients
      float n_ = 0.142857142857;
      vec3 ns = n_ * D.wyz - D.xzx;
      
      vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
      
      vec4 x_ = floor(j * ns.z);
      vec4 y_ = floor(j - 7.0 * x_);
      
      vec4 x = x_ *ns.x + ns.yyyy;
      vec4 y = y_ *ns.x + ns.yyyy;
      vec4 h = 1.0 - abs(x) - abs(y);
      
      vec4 b0 = vec4(x.xy, y.xy);
      vec4 b1 = vec4(x.zw, y.zw);
      
      vec4 s0 = floor(b0)*2.0 + 1.0;
      vec4 s1 = floor(b1)*2.0 + 1.0;
      vec4 sh = -step(h, vec4(0.0));
      
      vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
      vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
      
      vec3 p0 = vec3(a0.xy, h.x);
      vec3 p1 = vec3(a0.zw, h.y);
      vec3 p2 = vec3(a1.xy, h.z);
      vec3 p3 = vec3(a1.zw, h.w);
      
      // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0, p0), dot(p1, p1), dot(p2, p2), dot(p3, p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      
      // Mix final noise value
      vec4 m = max(0.6 - vec4(dot(x0, x0), dot(x1, x1), dot(x2, x2), dot(x3, x3)), 0.0);
      m = m * m;
      return 42.0 * dot(m*m, vec4(dot(p0, x0), dot(p1, x1), dot(p2, x2), dot(p3, x3)));
    }
    
    void main() {
      // Calculate surface features using noise
      float noise = snoise(vec3(vUv * noiseScale, time * 0.1));
      
      // Fresnel effect for atmosphere
      float fresnel = pow(1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0))), 2.0);
      
      // Mix planet color with noise and atmosphere
      vec3 finalColor = mix(baseColor, baseColor * (0.8 + noise * 0.4), 0.5);
      
      // Apply atmosphere with glow intensity
      vec3 glowColor = atmosphereColor * glowIntensity;
      finalColor = mix(finalColor, glowColor, fresnel * 0.6);
      
      gl_FragColor = vec4(finalColor, 1.0); // Always fully opaque
    }
  `;
  
  // Create several planets
  for (let i = 0; i < 3; i++) {
    // Create a sphere geometry for the planet
    const planetGeometry = new THREE.SphereGeometry(100 + Math.random() * 150, 32, 32);
    
    // Random colors for the planet
    let planetColor, atmosphereColor;
    
    const colorChoice = Math.random();
    if (colorChoice > 0.7) {
      // Earth-like
      planetColor = new THREE.Color(0.2, 0.4, 0.8);
      atmosphereColor = new THREE.Color(0.5, 0.7, 1.0);
    } else if (colorChoice > 0.4) {
      // Mars-like
      planetColor = new THREE.Color(0.8, 0.3, 0.2);
      atmosphereColor = new THREE.Color(0.9, 0.6, 0.3);
    } else {
      // Gas giant
      planetColor = new THREE.Color(0.8, 0.7, 0.5);
      atmosphereColor = new THREE.Color(0.9, 0.8, 0.6);
    }
    
    // Create shader material
    const planetMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        baseColor: { value: planetColor },
        atmosphereColor: { value: atmosphereColor },
        glowIntensity: { value: 1.0 },
        noiseScale: { value: 10.0 },
        atmosphereIntensity: { value: 0.5 }
      },
      vertexShader: planetVertexShader,
      fragmentShader: planetFragmentShader,
      side: THREE.FrontSide,
      transparent: false, // Ensure it's not transparent
      opacity: 1.0
    });
    
    // Create mesh
    const planet = new THREE.Mesh(planetGeometry, planetMaterial);
    
    // Random position (far away)
    const distance = 3000 + Math.random() * 2000;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 1000;
    
    planet.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );
    
    // Random rotation
    planet.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    // Register with physics system if available
    if (engine.getSystem('physics')) {
      const physicsSystem = engine.getSystem('physics');
      physicsSystem.registerObject(planet);
      
      // Set physics properties
      planet.physics.mass = 50000;
      planet.physics.isStatic = true;
      planet.physics.collisionRadius = planetGeometry.parameters.radius;
    }
    
    // Add to array
    planets.push(planet);
  }
  
  return planets;
};
