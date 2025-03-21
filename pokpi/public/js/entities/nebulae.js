/**
 * Nebulae Entity
 * Creates procedural nebulae with custom shaders
 */
import * as THREE from 'three';

export const createNebulae = (engine) => {
  // Array to hold all nebula objects
  const nebulae = [];
  
  // Create 2-3 nebulae at different locations (reduced count)
  const nebulaCount = 2 + Math.floor(Math.random() * 2);
  
  for (let i = 0; i < nebulaCount; i++) {
    // Custom nebula vertex shader
    const nebulaVertexShader = `
      uniform float time;
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      void main() {
        vPosition = position;
        vUv = uv;
        
        // Apply rotation to the vertex position
        float rotationSpeed = 0.1;
        float angle = time * rotationSpeed;
        
        // Rotate around Y axis
        float cosY = cos(angle);
        float sinY = sin(angle);
        vec3 rotatedPosition = vec3(
          position.x * cosY - position.z * sinY,
          position.y,
          position.x * sinY + position.z * cosY
        );
        
        vNormal = normalize(normalMatrix * normal);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(rotatedPosition, 1.0);
      }
    `;
    
    // Custom nebula fragment shader
    const nebulaFragmentShader = `
      uniform vec3 color1;
      uniform vec3 color2;
      uniform vec3 glowColor;
      uniform float time;
      
      varying vec3 vPosition;
      varying vec2 vUv;
      varying vec3 vNormal;
      
      // Simplex noise functions
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
        // Create noise patterns for the nebula
        float noiseScale = 0.01;
        float noiseTime = time * 0.1;
        
        // Create multiple layers of noise
        float noise1 = snoise(vPosition * noiseScale + vec3(noiseTime, 0.0, 0.0));
        float noise2 = snoise(vPosition * noiseScale * 2.0 + vec3(0.0, noiseTime, 0.0));
        
        // Combine noise patterns
        float combinedNoise = (noise1 + noise2) * 0.5 + 0.5;
        
        // Mix colors based on noise with increased brightness
        vec3 baseColor = mix(color1, color2, combinedNoise);
        
        // Add pulsating effect
        float pulse = 0.8 + 0.4 * sin(time * 0.3);
        
        // Add edge glow effect
        float edgeGlow = pow(1.0 - abs(dot(vNormal, vec3(0.0, 0.0, 1.0))), 2.0);
        
        // Brighten the colors
        vec3 finalColor = baseColor * 1.5 + glowColor * edgeGlow * pulse;
        
        // Apply distance falloff for soft edges
        float distanceFromCenter = length(vPosition) / 500.0;
        float edgeFalloff = 1.0 - smoothstep(0.7, 1.0, distanceFromCenter);
        
        // Increased opacity for more visible glow
        float opacity = edgeFalloff * (combinedNoise * 0.5 + 0.3) * (1.0 + edgeGlow * 0.5);
        
        gl_FragColor = vec4(finalColor, opacity);
      }
    `;
    
    // Choose nebula colors with increased brightness
    let color1, color2, glowColor;
    const colorType = Math.random();
    
    if (colorType > 0.7) {
      // Bright blue/purple nebula
      color1 = new THREE.Color(0.4, 0.6, 1.0);
      color2 = new THREE.Color(0.8, 0.5, 1.0);
      glowColor = new THREE.Color(0.5, 0.3, 1.0);
    } else if (colorType > 0.4) {
      // Bright red/orange nebula
      color1 = new THREE.Color(1.0, 0.4, 0.3);
      color2 = new THREE.Color(1.0, 0.7, 0.3);
      glowColor = new THREE.Color(1.0, 0.5, 0.2);
    } else {
      // Bright green/teal nebula
      color1 = new THREE.Color(0.3, 0.9, 0.5);
      color2 = new THREE.Color(0.3, 0.8, 1.0);
      glowColor = new THREE.Color(0.2, 1.0, 0.8);
    }
    
    // Create geometry (smaller sphere for the nebula)
    const nebulaGeometry = new THREE.SphereGeometry(200 + Math.random() * 100, 64, 64);
    
    // Create shader material
    const nebulaMaterial = new THREE.ShaderMaterial({
      uniforms: {
        color1: { value: color1 },
        color2: { value: color2 },
        glowColor: { value: glowColor },
        time: { value: 0 }
      },
      vertexShader: nebulaVertexShader,
      fragmentShader: nebulaFragmentShader,
      transparent: true,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide,
      depthWrite: false
    });
    
    // Create mesh
    const nebula = new THREE.Mesh(nebulaGeometry, nebulaMaterial);
    
    // Random position
    const distance = 2000 + Math.random() * 2000;
    const angle = Math.random() * Math.PI * 2;
    const height = (Math.random() - 0.5) * 1000;
    
    nebula.position.set(
      Math.cos(angle) * distance,
      height,
      Math.sin(angle) * distance
    );
    
    // Random rotation
    nebula.rotation.set(
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2,
      Math.random() * Math.PI * 2
    );
    
    // Add a point light inside the nebula for extra glow
    const light = new THREE.PointLight(
      glowColor,
      1.0,
      500
    );
    nebula.add(light);
    
    // Set user data for identification
    nebula.userData = {
      type: 'nebula',
      name: `Nebula ${i+1}`,
      description: `A cosmic cloud of gas and dust`
    };
    
    // Add to array
    nebulae.push(nebula);
  }
  
  return nebulae;
};
