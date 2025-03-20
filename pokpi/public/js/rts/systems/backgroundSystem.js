/**
 * Background System
 * Creates a dynamic space background with stars and nebulae
 */
import * as THREE from 'three';

export const backgroundSystem = {
  name: 'background',
  
  // System state
  stars: null,
  nebulae: [],
  
  // Initialize the system
  init(engine) {
    // Create starfield
    this.createStarfield(engine);
    
    // Create nebulae
    this.createNebulae(engine);
    
    // Create distant planets
    this.createDistantPlanets(engine);
    
    // Create additional space objects
    this.createSpaceObjects(engine);
  },
  
  // Create starfield with thousands of stars
  createStarfield(engine) {
    const starCount = 3000; // More stars for a richer background
    const starGeometry = new THREE.BufferGeometry();
    const starPositions = [];
    const starColors = [];
    const starSizes = [];
    
    // Generate random stars
    for (let i = 0; i < starCount; i++) {
      // Random position in a large sphere around the camera
      const radius = 1000 + Math.random() * 1000;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      const x = radius * Math.sin(phi) * Math.cos(theta);
      const y = radius * Math.sin(phi) * Math.sin(theta);
      const z = -radius * Math.cos(phi); // Negative to place behind the scene
      
      starPositions.push(x, y, z);
      
      // Random star color (mostly white/blue with some variation)
      const colorChoice = Math.random();
      if (colorChoice > 0.9) {
        // Red/orange star
        starColors.push(1.0, 0.7 + Math.random() * 0.3, 0.3 + Math.random() * 0.3);
      } else if (colorChoice > 0.8) {
        // Yellow star
        starColors.push(1.0, 1.0, 0.7 + Math.random() * 0.3);
      } else if (colorChoice > 0.6) {
        // Blue star
        starColors.push(0.7 + Math.random() * 0.3, 0.8 + Math.random() * 0.2, 1.0);
      } else {
        // White star with slight blue tint
        const intensity = 0.8 + Math.random() * 0.2;
        starColors.push(intensity, intensity, intensity + Math.random() * 0.2);
      }
      
      // Random star size
      starSizes.push(Math.random() * 3 + 1);
    }
    
    // Create buffer attributes
    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starPositions, 3));
    starGeometry.setAttribute('color', new THREE.Float32BufferAttribute(starColors, 3));
    starGeometry.setAttribute('size', new THREE.Float32BufferAttribute(starSizes, 1));
    
    // Create star material with custom shader
    const starMaterial = new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 }
      },
      vertexShader: `
        attribute float size;
        attribute vec3 color;
        varying vec3 vColor;
        uniform float time;
        
        void main() {
          vColor = color;
          vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
          
          // Twinkle effect
          float twinkle = sin(time * 2.0 + position.x * 0.01 + position.y * 0.01) * 0.2 + 0.8;
          
          gl_PointSize = size * twinkle * (300.0 / -mvPosition.z);
          gl_Position = projectionMatrix * mvPosition;
        }
      `,
      fragmentShader: `
        varying vec3 vColor;
        
        void main() {
          // Create circular point
          float r = distance(gl_PointCoord, vec2(0.5, 0.5));
          if (r > 0.5) discard;
          
          // Add glow effect
          float intensity = 1.0 - r * 2.0;
          gl_FragColor = vec4(vColor, intensity);
        }
      `,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    });
    
    // Create star points
    this.stars = new THREE.Points(starGeometry, starMaterial);
    engine.scene.add(this.stars);
  },
  
  // Create nebulae in the background
  createNebulae(engine) {
    const nebulaCount = 3;
    
    for (let i = 0; i < nebulaCount; i++) {
      // Create nebula geometry
      const size = 800 + Math.random() * 1200;
      const segments = 128;
      const geometry = new THREE.PlaneGeometry(size, size, segments, segments);
      
      // Create nebula texture using noise
      const textureSize = 512;
      const data = new Uint8Array(textureSize * textureSize * 4);
      
      // Generate noise-based texture
      for (let y = 0; y < textureSize; y++) {
        for (let x = 0; x < textureSize; x++) {
          const index = (y * textureSize + x) * 4;
          
          // Normalized coordinates
          const nx = x / textureSize * 5;
          const ny = y / textureSize * 5;
          
          // Generate noise value
          let noise = this.simplex2(nx, ny);
          noise = (noise + 1) / 2; // Normalize to 0-1
          
          // Apply threshold for cloud-like effect
          const threshold = 0.5;
          const alpha = noise > threshold ? (noise - threshold) / (1 - threshold) : 0;
          
          // Choose nebula color
          let r, g, b;
          const colorType = i % 3;
          
          if (colorType === 0) {
            // Blue/purple nebula
            r = 0.3 * noise;
            g = 0.4 * noise;
            b = 0.9 * noise;
          } else if (colorType === 1) {
            // Red/orange nebula
            r = 0.9 * noise;
            g = 0.4 * noise;
            b = 0.2 * noise;
          } else {
            // Green/teal nebula
            r = 0.2 * noise;
            g = 0.8 * noise;
            b = 0.6 * noise;
          }
          
          data[index] = Math.floor(r * 255);
          data[index + 1] = Math.floor(g * 255);
          data[index + 2] = Math.floor(b * 255);
          data[index + 3] = Math.floor(alpha * 100); // Lower alpha for subtle effect
        }
      }
      
      // Create texture from data
      const texture = new THREE.DataTexture(data, textureSize, textureSize, THREE.RGBAFormat);
      texture.needsUpdate = true;
      
      // Create nebula material
      const material = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        blending: THREE.AdditiveBlending,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      
      // Create nebula mesh
      const nebula = new THREE.Mesh(geometry, material);
      
      // Position nebula at random location in background
      nebula.position.z = -1500 - Math.random() * 500;
      nebula.position.x = (Math.random() - 0.5) * 2000;
      nebula.position.y = (Math.random() - 0.5) * 2000;
      
      // Random rotation
      nebula.rotation.z = Math.random() * Math.PI * 2;
      
      engine.scene.add(nebula);
      this.nebulae.push(nebula);
    }
  },
  
  // Update system
  update(deltaTime, engine) {
    // Animate stars (twinkle effect)
    if (this.stars && this.stars.material) {
      this.stars.material.uniforms.time.value += deltaTime;
    }
    
    // Slowly rotate nebulae
    this.nebulae.forEach(nebula => {
      nebula.rotation.z += deltaTime * 0.01;
    });
    
    // Animate asteroids
    if (this.asteroids) {
      this.asteroids.forEach(asteroid => {
        asteroid.rotation.x += deltaTime * 0.1 * Math.random();
        asteroid.rotation.y += deltaTime * 0.1 * Math.random();
      });
    }
    
    // Animate space station
    if (this.spaceStation) {
      this.spaceStation.rotation.y += deltaTime * 0.05;
    }
    
    // Animate wormhole
    if (this.wormhole) {
      this.wormhole.children.forEach((ring, i) => {
        ring.rotation.z += deltaTime * (0.2 + i * 0.01);
      });
    }
  },
  
  // Simple noise function for nebula generation
  simplex2(x, y) {
    const F2 = 0.5 * (Math.sqrt(3) - 1);
    const G2 = (3 - Math.sqrt(3)) / 6;
    
    const s = (x + y) * F2;
    const i = Math.floor(x + s);
    const j = Math.floor(y + s);
    
    const t = (i + j) * G2;
    const X0 = i - t;
    const Y0 = j - t;
    const x0 = x - X0;
    const y0 = y - Y0;
    
    let i1, j1;
    if (x0 > y0) {
      i1 = 1;
      j1 = 0;
    } else {
      i1 = 0;
      j1 = 1;
    }
    
    const x1 = x0 - i1 + G2;
    const y1 = y0 - j1 + G2;
    const x2 = x0 - 1 + 2 * G2;
    const y2 = y0 - 1 + 2 * G2;
    
    // Hash coordinates
    const h0 = this.hash(i, j) % 12;
    const h1 = this.hash(i + i1, j + j1) % 12;
    const h2 = this.hash(i + 1, j + 1) % 12;
    
    // Calculate noise contributions
    const n0 = this.dot(this.grad3[h0], x0, y0);
    const n1 = this.dot(this.grad3[h1], x1, y1);
    const n2 = this.dot(this.grad3[h2], x2, y2);
    
    // Add contributions
    return 70 * (n0 + n1 + n2);
  },
  
  // Hash function for noise
  hash(i, j) {
    return (i * 73 ^ j * 31) & 0xFF;
  },
  
  // Dot product for noise
  dot(g, x, y) {
    return g[0] * x + g[1] * y;
  },
  
  // Gradient vectors for noise
  grad3: [
    [1, 1], [-1, 1], [1, -1], [-1, -1],
    [1, 0], [-1, 0], [1, 0], [-1, 0],
    [0, 1], [0, -1], [0, 1], [0, -1]
  ],
  
  // Create distant planets
  createDistantPlanets(engine) {
    const planetCount = 3;
    
    for (let i = 0; i < planetCount; i++) {
      // Create planet geometry
      const radius = 50 + Math.random() * 100;
      const geometry = new THREE.SphereGeometry(radius, 32, 32);
      
      // Create planet material
      const hue = Math.random();
      const saturation = 0.5 + Math.random() * 0.5;
      const lightness = 0.3 + Math.random() * 0.2;
      
      const color = new THREE.Color().setHSL(hue, saturation, lightness);
      const material = new THREE.MeshBasicMaterial({ color });
      
      const planet = new THREE.Mesh(geometry, material);
      
      // Position planet at a random distant location
      const distance = 1500 + Math.random() * 500;
      const angle = Math.random() * Math.PI * 2;
      
      planet.position.set(
        Math.cos(angle) * distance,
        Math.sin(angle) * distance,
        -1000 - Math.random() * 500
      );
      
      engine.scene.add(planet);
    }
  },
  
  // Add this method to create more interesting space objects
  createSpaceObjects(engine) {
    // Create asteroid field
    this.createAsteroidField(engine);
    
    // Create distant space station
    this.createSpaceStation(engine);
    
    // Create wormhole effect
    this.createWormhole(engine);
  },
  
  // Create asteroid field
  createAsteroidField(engine) {
    const asteroidCount = 100;
    const asteroids = [];
    
    // Create asteroid geometries with different shapes
    const geometries = [
      new THREE.IcosahedronGeometry(1, 0), // Rough asteroid
      new THREE.TetrahedronGeometry(1, 0), // Angular asteroid
      new THREE.DodecahedronGeometry(1, 0) // Another shape
    ];
    
    // Create asteroid material
    const material = new THREE.MeshBasicMaterial({
      color: 0x888888,
      wireframe: true
    });
    
    // Create asteroids
    for (let i = 0; i < asteroidCount; i++) {
      // Random geometry
      const geometry = geometries[Math.floor(Math.random() * geometries.length)];
      
      // Create mesh
      const asteroid = new THREE.Mesh(geometry, material);
      
      // Random size
      const scale = 5 + Math.random() * 15;
      asteroid.scale.set(scale, scale, scale);
      
      // Random position in a ring
      const radius = 500 + Math.random() * 1000;
      const angle = Math.random() * Math.PI * 2;
      const height = (Math.random() - 0.5) * 300;
      
      asteroid.position.set(
        Math.cos(angle) * radius,
        Math.sin(angle) * radius,
        height
      );
      
      // Random rotation
      asteroid.rotation.x = Math.random() * Math.PI;
      asteroid.rotation.y = Math.random() * Math.PI;
      asteroid.rotation.z = Math.random() * Math.PI;
      
      // Add to scene
      engine.scene.add(asteroid);
      asteroids.push(asteroid);
    }
    
    // Store for animation
    this.asteroids = asteroids;
  },
  
  // Create distant space station
  createSpaceStation(engine) {
    // Create space station frame
    const stationGroup = new THREE.Group();
    
    // Main ring
    const ringGeometry = new THREE.TorusGeometry(100, 10, 16, 100);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      color: 0x4a6fa5,
      wireframe: true
    });
    const ring = new THREE.Mesh(ringGeometry, ringMaterial);
    stationGroup.add(ring);
    
    // Central hub
    const hubGeometry = new THREE.SphereGeometry(40, 16, 16);
    const hubMaterial = new THREE.MeshBasicMaterial({
      color: 0x3498db,
      wireframe: true
    });
    const hub = new THREE.Mesh(hubGeometry, hubMaterial);
    stationGroup.add(hub);
    
    // Spokes connecting hub to ring
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2;
      const spokeGeometry = new THREE.CylinderGeometry(5, 5, 60, 8);
      const spokeMaterial = new THREE.MeshBasicMaterial({
        color: 0x4a6fa5,
        wireframe: true
      });
      const spoke = new THREE.Mesh(spokeGeometry, spokeMaterial);
      
      // Position and rotate spoke
      spoke.position.set(
        Math.cos(angle) * 50,
        Math.sin(angle) * 50,
        0
      );
      spoke.rotation.z = angle + Math.PI / 2;
      
      stationGroup.add(spoke);
    }
    
    // Position station in distance
    stationGroup.position.set(-800, 400, -500);
    stationGroup.rotation.x = Math.PI / 4;
    
    engine.scene.add(stationGroup);
    this.spaceStation = stationGroup;
  },
  
  // Create wormhole effect
  createWormhole(engine) {
    const segments = 100;
    const rings = 20;
    const radius = 100;
    
    const wormholeGroup = new THREE.Group();
    
    // Create rings
    for (let i = 0; i < rings; i++) {
      const ringGeometry = new THREE.RingGeometry(
        radius - 2, 
        radius, 
        segments
      );
      
      const ringMaterial = new THREE.MeshBasicMaterial({
        color: new THREE.Color().setHSL(0.6, 1, 0.5),
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      });
      
      const ring = new THREE.Mesh(ringGeometry, ringMaterial);
      
      // Position ring in z-space to create tunnel effect
      ring.position.z = -i * 20;
      
      // Scale ring to create perspective
      const scale = 1 - (i / rings) * 0.5;
      ring.scale.set(scale, scale, 1);
      
      wormholeGroup.add(ring);
    }
    
    // Position wormhole
    wormholeGroup.position.set(700, -300, -800);
    wormholeGroup.rotation.y = Math.PI / 6;
    
    engine.scene.add(wormholeGroup);
    this.wormhole = wormholeGroup;
  }
};

export default backgroundSystem; 