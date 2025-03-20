/**
 * Spaceship Entity
 * Creates a futuristic spaceship with glowing elements
 */
import * as THREE from 'three';

export const createSpaceship = (engine) => {
  // Define colors with brighter, glowing palette
  const Colors = {
    primary: 0xffaaff,     // Bright blue
    accent: 0xff33aa,      // Bright pink
    glow: 0x66ffff,        // Cyan glow
    metal: 0xe0e0e8,       // Light silver
    glass: 0x88ccff,       // Light blue glass
    engine: 0xff3300,      // Orange-red engine
    trim: 0xffcc00         // Gold trim
  };

  // Create a silver-plate material with high reflectivity
  const createSilverPlateMaterial = () => {
    return new THREE.MeshPhongMaterial({
      color: 0xCCC3C0,       // Silver base color
      specular: 0xFFFFFF,     // White specular highlights
      shininess: 100,         // High shininess for metallic look
      flatShading: false,     // Smooth shading for reflective surface
      emissive: 0x333333,     // Slight emissive for ambient glow
      emissiveIntensity: 0.1
    });
  };

  // Create the main spaceship object
  const spaceship = new THREE.Object3D();
  
  // Create the main body - more elongated and streamlined
  const geomBody = new THREE.CylinderGeometry(20, 30, 120, 8, 1);
  geomBody.rotateZ(Math.PI/2); // Align horizontally
  const matBody = new THREE.MeshPhongMaterial({
    color: Colors.primary, 
    flatShading: true,
    emissive: Colors.primary,
    emissiveIntensity: 0.2
  });
  const body = new THREE.Mesh(geomBody, matBody);
  body.castShadow = true;
  body.receiveShadow = true;
  spaceship.add(body);
  
  // Create the cockpit - more angular and futuristic
  const geomCockpit = new THREE.SphereGeometry(25, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  geomCockpit.rotateX(Math.PI);
  geomCockpit.rotateY(Math.PI/2);
  geomCockpit.scale(1.5, 1, 1);
  const matCockpit = new THREE.MeshPhongMaterial({
    color: Colors.metal, 
    flatShading: true,
    emissive: Colors.primary,
    emissiveIntensity: 0.1
  });
  const cockpit = new THREE.Mesh(geomCockpit, matCockpit);
  cockpit.position.set(40, 0, 0);
  cockpit.castShadow = true;
  cockpit.receiveShadow = true;
  spaceship.add(cockpit);
  
  // Create engine section - more detailed with glowing parts
  const geomEngineSection = new THREE.CylinderGeometry(30, 20, 40, 8, 1);
  geomEngineSection.rotateZ(Math.PI/2);
  const matEngineSection = new THREE.MeshPhongMaterial({
    color: Colors.metal, 
    flatShading: true
  });
  const engineSection = new THREE.Mesh(geomEngineSection, matEngineSection);
  engineSection.position.x = -60;
  engineSection.castShadow = true;
  engineSection.receiveShadow = true;
  spaceship.add(engineSection);
  
  // Create engine glow
  const geomEngineGlow = new THREE.CylinderGeometry(15, 5, 10, 16, 1);
  geomEngineGlow.rotateZ(Math.PI/2);
  const matEngineGlow = new THREE.MeshPhongMaterial({
    color: Colors.engine,
    flatShading: true,
    emissive: Colors.engine,
    emissiveIntensity: 1.0,
    transparent: true,
    opacity: 0.9
  });
  const engineGlow = new THREE.Mesh(geomEngineGlow, matEngineGlow);
  engineGlow.position.x = -80;
  spaceship.add(engineGlow);
  
  // Create fireburst effect at the rear
  const createFireburstEffect = () => {
    // Create a group to hold all fireburst elements
    const fireburstGroup = new THREE.Group();
    fireburstGroup.position.set(-85, 0, 0); // Position at the rear of the ship
    
    // Create the main flame cone
    const geomFlame = new THREE.ConeGeometry(12, 40, 16, 1, true);
    geomFlame.rotateX(Math.PI); // Point backward
    geomFlame.rotateZ(Math.PI/2);
    
    const matFlame = new THREE.MeshBasicMaterial({
      color: Colors.engine,
      transparent: true,
      opacity: 0.7,
      emissive: Colors.engine,
      emissiveIntensity: 1.0
    });
    
    const flame = new THREE.Mesh(geomFlame, matFlame);
    fireburstGroup.add(flame);
    
    // Create inner flame (brighter)
    const geomInnerFlame = new THREE.ConeGeometry(6, 30, 16, 1, true);
    geomInnerFlame.rotateX(Math.PI);
    geomInnerFlame.rotateZ(Math.PI/2);
    
    const matInnerFlame = new THREE.MeshBasicMaterial({
      color: 0xffff00, // Yellow core
      transparent: true,
      opacity: 0.9,
      emissive: 0xffff00,
      emissiveIntensity: 1.0
    });
    
    const innerFlame = new THREE.Mesh(geomInnerFlame, matInnerFlame);
    fireburstGroup.add(innerFlame);
    
    // Add particles for sparks
    const particleCount = 100;
    const particleGeometry = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleSizes = new Float32Array(particleCount);
    
    for (let i = 0; i < particleCount; i++) {
      // Position particles in a cone shape behind the engine
      const angle = Math.random() * Math.PI * 2;
      const radius = Math.random() * 10;
      const distance = Math.random() * 60 + 10;
      
      particlePositions[i * 3] = -distance; // X (behind the ship)
      particlePositions[i * 3 + 1] = Math.sin(angle) * radius; // Y
      particlePositions[i * 3 + 2] = Math.cos(angle) * radius; // Z
      
      particleSizes[i] = Math.random() * 3 + 1;
    }
    
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));
    particleGeometry.setAttribute('size', new THREE.BufferAttribute(particleSizes, 1));
    
    const particleMaterial = new THREE.PointsMaterial({
      color: 0xffaa00,
      size: 2,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      sizeAttenuation: true
    });
    
    const particles = new THREE.Points(particleGeometry, particleMaterial);
    fireburstGroup.add(particles);
    
    // Add a point light for the fireburst glow
    const fireLight = new THREE.PointLight(0xff5500, 2, 100);
    fireLight.position.set(-20, 0, 0);
    fireburstGroup.add(fireLight);
    
    // Add animation properties
    fireburstGroup.flame = flame;
    fireburstGroup.innerFlame = innerFlame;
    fireburstGroup.particles = particles;
    fireburstGroup.fireLight = fireLight;
    
    return fireburstGroup;
  };

  // Create and add the fireburst effect
  const fireburst = createFireburstEffect();
  spaceship.add(fireburst);
  
  // Create wings - more angular and swept back
  const geomWingLeft = new THREE.BoxGeometry(80, 5, 100, 1, 1, 1);
  // Use position attribute instead of vertices
  const wingPositions = geomWingLeft.getAttribute('position');
  // Modify specific vertices to create swept-back shape
  // Bottom front vertices
  wingPositions.setY(0, -10);
  wingPositions.setY(1, -10);
  // Top front vertices
  wingPositions.setX(4, wingPositions.getX(4) + 20);
  wingPositions.setX(5, wingPositions.getX(5) + 20);
  
  const matWing = new THREE.MeshPhongMaterial({
    color: Colors.accent, 
    flatShading: true,
    emissive: Colors.accent,
    emissiveIntensity: 0.3
  });
  const wingLeft = new THREE.Mesh(geomWingLeft, matWing);
  wingLeft.position.set(-20, 0, -40);
  wingLeft.castShadow = true;
  wingLeft.receiveShadow = true;
  spaceship.add(wingLeft);
  
  const wingRight = wingLeft.clone();
  wingRight.position.set(-20, 0, 40);
  wingRight.rotation.y = Math.PI;
  spaceship.add(wingRight);
  
  // Create stabilizer fins
  const geomFin = new THREE.BoxGeometry(30, 30, 5, 1, 1, 1);
  // Use position attribute instead of vertices
  const finPositions = geomFin.getAttribute('position');
  // Modify specific vertices to create angled shape
  finPositions.setX(0, finPositions.getX(0) - 10);
  finPositions.setX(1, finPositions.getX(1) - 10);
  const matFin = new THREE.MeshPhongMaterial({
    color: Colors.accent, 
    flatShading: true,
    emissive: Colors.accent,
    emissiveIntensity: 0.3
  });
  const finTop = new THREE.Mesh(geomFin, matFin);
  finTop.position.set(-60, 25, 0);
  finTop.castShadow = true;
  finTop.receiveShadow = true;
  spaceship.add(finTop);
  
  const finBottom = finTop.clone();
  finBottom.position.set(-60, -25, 0);
  finBottom.rotation.x = Math.PI;
  spaceship.add(finBottom);
  
  // Add cockpit glass - more futuristic with glow
  const geomGlass = new THREE.SphereGeometry(20, 8, 8, 0, Math.PI * 2, 0, Math.PI * 0.5);
  geomGlass.rotateX(Math.PI);
  geomGlass.rotateY(Math.PI/2);
  geomGlass.scale(1.2, 0.8, 0.8);
  const matGlass = new THREE.MeshPhongMaterial({
    color: Colors.glass,
    transparent: true,
    opacity: 0.7,
    flatShading: true,
    emissive: Colors.glow,
    emissiveIntensity: 0.3
  });
  const glass = new THREE.Mesh(geomGlass, matGlass);
  glass.position.set(55, 0, 0);
  spaceship.add(glass);
  
  // Add trim details
  const geomTrim = new THREE.BoxGeometry(100, 2, 2, 1, 1, 1);
  const matTrim = new THREE.MeshPhongMaterial({
    color: Colors.trim,
    flatShading: true,
    emissive: Colors.trim,
    emissiveIntensity: 0.5
  });
  const trimTop = new THREE.Mesh(geomTrim, matTrim);
  trimTop.position.set(0, 20, 0);
  spaceship.add(trimTop);
  
  const trimBottom = trimTop.clone();
  trimBottom.position.set(0, -20, 0);
  spaceship.add(trimBottom);
  
  // Add engine lights with stronger glow
  const engineLight = new THREE.PointLight(Colors.engine, 2, 150);
  engineLight.position.set(-80, 0, 0);
  spaceship.add(engineLight);
  
  // Add cockpit light
  const cockpitLight = new THREE.PointLight(Colors.glow, 1, 80);
  cockpitLight.position.set(50, 0, 0);
  spaceship.add(cockpitLight);
  
  // Add accent lights
  const accentLight = new THREE.PointLight(Colors.accent, 0.8, 100);
  accentLight.position.set(0, 30, 0);
  spaceship.add(accentLight);
  
  // Set position in space
  // spaceship.position.set(500, 200, -800);
  // spaceship.rotation.set(Math.PI/6, Math.PI/4, 0);
  
  // Add to scene
  engine.scene.add(spaceship);
  
  // Add silver-plated hull sections
  const addSilverPlating = () => {
    // Silver plate material
    const matSilverPlate = createSilverPlateMaterial();
    
    // Top hull plating
    const geomTopPlate = new THREE.BoxGeometry(80, 2, 40, 8, 1, 4);
    const topPlate = new THREE.Mesh(geomTopPlate, matSilverPlate);
    topPlate.position.set(0, 20, 0);
    topPlate.castShadow = true;
    topPlate.receiveShadow = true;
    spaceship.add(topPlate);
    
    // Bottom hull plating
    const geomBottomPlate = new THREE.BoxGeometry(80, 2, 40, 8, 1, 4);
    const bottomPlate = new THREE.Mesh(geomBottomPlate, matSilverPlate);
    bottomPlate.position.set(0, -20, 0);
    bottomPlate.castShadow = true;
    bottomPlate.receiveShadow = true;
    spaceship.add(bottomPlate);
    
    // Side hull plating - left
    const geomLeftPlate = new THREE.BoxGeometry(80, 40, 2, 8, 4, 1);
    const leftPlate = new THREE.Mesh(geomLeftPlate, matSilverPlate);
    leftPlate.position.set(0, 0, -20);
    leftPlate.castShadow = true;
    leftPlate.receiveShadow = true;
    spaceship.add(leftPlate);
    
    // Side hull plating - right
    const geomRightPlate = new THREE.BoxGeometry(80, 40, 2, 8, 4, 1);
    const rightPlate = new THREE.Mesh(geomRightPlate, matSilverPlate);
    rightPlate.position.set(0, 0, 20);
    rightPlate.castShadow = true;
    rightPlate.receiveShadow = true;
    spaceship.add(rightPlate);
    
    // Cockpit rim plating
    const geomCockpitRim = new THREE.TorusGeometry(25, 3, 8, 16, Math.PI);
    geomCockpitRim.rotateY(Math.PI/2);
    const cockpitRim = new THREE.Mesh(geomCockpitRim, matSilverPlate);
    cockpitRim.position.set(40, 0, 0);
    cockpitRim.castShadow = true;
    cockpitRim.receiveShadow = true;
    spaceship.add(cockpitRim);
    
    // Engine housing plating
    const geomEngineRim = new THREE.CylinderGeometry(32, 22, 5, 16, 1);
    geomEngineRim.rotateZ(Math.PI/2);
    const engineRim = new THREE.Mesh(geomEngineRim, matSilverPlate);
    engineRim.position.set(-60, 0, 0);
    engineRim.castShadow = true;
    engineRim.receiveShadow = true;
    spaceship.add(engineRim);
    
    // Wing edge plating - left
    const geomWingEdgeLeft = new THREE.BoxGeometry(80, 2, 5, 8, 1, 1);
    const wingEdgeLeft = new THREE.Mesh(geomWingEdgeLeft, matSilverPlate);
    wingEdgeLeft.position.set(-20, 0, -90);
    wingEdgeLeft.castShadow = true;
    wingEdgeLeft.receiveShadow = true;
    spaceship.add(wingEdgeLeft);
    
    // Wing edge plating - right
    const geomWingEdgeRight = new THREE.BoxGeometry(80, 2, 5, 8, 1, 1);
    const wingEdgeRight = new THREE.Mesh(geomWingEdgeRight, matSilverPlate);
    wingEdgeRight.position.set(-20, 0, 90);
    wingEdgeRight.castShadow = true;
    wingEdgeRight.receiveShadow = true;
    spaceship.add(wingEdgeRight);
    
    return matSilverPlate; // Return for hover effect
  };

  // Call the function after creating the main parts
  const matSilverPlate = addSilverPlating();

  // Modify the hover effect to only show info panel without color changes
  spaceship.onHover = (isHovered) => {
    // Log hover state change - this will be used by the UI system
    console.log(`Spaceship hover state: ${isHovered ? 'active' : 'inactive'}`);
    
    // The UI system will handle showing the info panel based on this event
    // We're not changing any colors or materials here
    
    // You can still keep a subtle engine glow change if desired
    engineLight.intensity = isHovered ? 2.2 : 2.0;
  };
  
  // Add metadata
  spaceship.entityInfo = {
    name: "Stellar Voyager",
    type: "Spaceship",
    class: "Interstellar",
    crew: "5",
    status: "Operational",
    mission: "Deep space exploration",
    propulsion: "Quantum drive"
  };
  
  // Add physics properties
  spaceship.physics = {
    mass: 500,
    velocity: new THREE.Vector3(0, 0, 0),
    acceleration: new THREE.Vector3(0, 0, 0),
    collisionRadius: 50,
    applyForce: (force) => {
      spaceship.physics.acceleration.add(force.clone().divideScalar(spaceship.physics.mass));
    }
  };
  
  // Add update method for animations
  spaceship.update = (deltaTime) => {
    // Animate engine glow
    engineGlow.scale.set(
      1 + 0.1 * Math.sin(Date.now() * 0.01),
      1 + 0.1 * Math.sin(Date.now() * 0.01),
      1 + 0.1 * Math.sin(Date.now() * 0.01)
    );
    
    // Animate engine light
    const isHovered = engineLight.intensity > 2.5;
    engineLight.intensity = (isHovered ? 3 : 2) + 0.3 * Math.sin(Date.now() * 0.005);
    
    // Apply physics
    spaceship.physics.velocity.add(
      spaceship.physics.acceleration.clone().multiplyScalar(deltaTime)
    );
    
    // Apply slight oscillation for a "floating in space" effect
    const floatAmplitude = 0.5;
    const floatFrequency = 0.2;
    const yOffset = Math.sin(Date.now() * 0.001 * floatFrequency) * floatAmplitude;
    const xOffset = Math.cos(Date.now() * 0.001 * floatFrequency * 0.7) * floatAmplitude * 0.5;
    
    spaceship.position.y += yOffset * deltaTime * 5;
    spaceship.position.x += xOffset * deltaTime * 5;
    
    // Reset acceleration
    spaceship.physics.acceleration.set(0, 0, 0);
    
    // Animate fireburst effect
    const time = Date.now() * 0.01;
    
    // Pulsate the flames
    const flameScale = 0.9 + 0.2 * Math.sin(time * 0.5);
    fireburst.flame.scale.set(flameScale, 1 + 0.3 * Math.sin(time * 0.7), flameScale);
    fireburst.innerFlame.scale.set(flameScale * 0.8, 1 + 0.4 * Math.sin(time * 0.9), flameScale * 0.8);
    
    // Animate particles
    const particlePositions = fireburst.particles.geometry.attributes.position.array;
    for (let i = 0; i < particlePositions.length; i += 3) {
      // Move particles outward
      particlePositions[i] -= 0.5 * deltaTime * 60; // Move backward faster
      
      // Reset particles that go too far
      if (particlePositions[i] < -70) {
        particlePositions[i] = -10;
        particlePositions[i+1] = (Math.random() - 0.5) * 10;
        particlePositions[i+2] = (Math.random() - 0.5) * 10;
      }
    }
    fireburst.particles.geometry.attributes.position.needsUpdate = true;
    
    // Flicker the fire light
    fireburst.fireLight.intensity = 1.5 + 0.5 * Math.sin(time * 2);
  };
  
  // Modify the followCamera method to position the spaceship lower and more forward
  spaceship.followCamera = (camera) => {
    // Position the spaceship in front of the camera
    const cameraDirection = new THREE.Vector3(0, 0, -1);
    cameraDirection.applyQuaternion(camera.quaternion);
    
    // Increase distance to move spaceship further forward
    const distance = 100; // Increased from 70 to 100 to be much further forward
    
    // Lower the offset significantly to position it well below the camera view
    // and maintain the z-index offset
    const offset = new THREE.Vector3(0, -35, 20); // Increased y-offset from -20 to -35
    
    // Calculate position
    const targetPosition = new THREE.Vector3()
      .copy(camera.position)
      .add(cameraDirection.multiplyScalar(distance))
      .add(offset);
    
    // Set spaceship position
    spaceship.position.copy(targetPosition);
    
    // Make spaceship face same direction as camera
    spaceship.quaternion.copy(camera.quaternion);
    
    // Add 90 degree rotation to the left (around the Y axis)
    const leftRotationAxis = new THREE.Vector3(0, 1, 0);
    const leftRotationQuaternion = new THREE.Quaternion().setFromAxisAngle(
      leftRotationAxis, 
      Math.PI * 0.5 // 90 degrees in radians
    );
    spaceship.quaternion.multiply(leftRotationQuaternion);
    
    // Add slight roll for visual interest
    const rollAxis = new THREE.Vector3(0, 0, 1);
    const rollQuaternion = new THREE.Quaternion().setFromAxisAngle(rollAxis, Math.PI * 0.05);
    spaceship.quaternion.multiply(rollQuaternion);
  };

  // Update the spaceship update method to include camera following
  const originalUpdate = spaceship.update;
  spaceship.update = (deltaTime, camera) => {
    // Call the original update method
    originalUpdate(deltaTime);
    
    // Follow camera if provided
    if (camera) {
      spaceship.followCamera(camera);
    }
    
    // Disable the automatic floating motion when following camera
    // (already handled by the followCamera method)
  };

  // Also make it even smaller
  spaceship.scale.set(0.5, 0.5, 0.5); // Reduced from 0.7

  // Adjust the fireburst to be more visible from behind
  fireburst.position.x = -60; // Move it further back
  fireburst.scale.set(1.5, 1.5, 1.5); // Make it larger
  
  // Add this near the end of the createSpaceship function:
  engine.entities.spaceship = spaceship;
  
  return spaceship;
};