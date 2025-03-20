/**
 * Physics System
 * Handles gravity, movement, and collisions in space
 */
import * as THREE from 'three';

export const physicsSystem = {
  name: 'physics',
  
  // System state
  gravitationalConstant: 6.67430e-11, // Actual G value
  timeScale: 1.0, // Time scaling factor
  simulationScale: 1e-6, // Scale factor for distances
  physicsObjects: [],
  debugMode: false,
  debugLines: [],
  
  // Physics settings
  settings: {
    enableGravity: true,
    enableCollisions: true,
    damping: 0.01, // Velocity damping factor
    maxVelocity: 100, // Maximum velocity magnitude
    solverIterations: 3 // Number of constraint solver iterations
  },
  
  // Initialize the system
  init(engine) {
    this.engine = engine;
    
    // Create debug visualization group
    this.debugGroup = new THREE.Group();
    engine.scene.add(this.debugGroup);
    
    // Set up event listeners for debug mode
    window.addEventListener('keydown', (e) => {
      if (e.key === 'p') {
        this.debugMode = !this.debugMode;
        this.debugGroup.visible = this.debugMode;
        console.log(`Physics debug mode: ${this.debugMode ? 'ON' : 'OFF'}`);
      }
    });
    
    // Register existing entities that might have physics components
    if (engine.entities) {
      engine.entities.forEach(entity => {
        if (entity.physics) {
          this.registerObject(entity);
        }
      });
    }
    
    // Scan the scene for objects with physics components
    this.scanSceneForPhysicsObjects(engine.scene);
  },
  
  // Scan scene recursively for physics objects
  scanSceneForPhysicsObjects(object) {
    if (object.physics && !this.physicsObjects.includes(object)) {
      this.registerObject(object);
    }
    
    // Recursively check children
    if (object.children && object.children.length > 0) {
      object.children.forEach(child => this.scanSceneForPhysicsObjects(child));
    }
  },
  
  // Register a physics object
  registerObject(object) {
    // If object already has physics component, use it
    if (!object.physics) {
      object.physics = {
        mass: 1.0,
        velocity: new THREE.Vector3(0, 0, 0),
        acceleration: new THREE.Vector3(0, 0, 0),
        isStatic: false,
        collisionRadius: 1.0,
        applyGravity: true,
        applyCollisions: true,
        restitution: 0.8, // Bounciness
        friction: 0.1 // Friction coefficient
      };
    }
    
    // If collision radius is not set, try to determine from geometry
    if (object.physics.collisionRadius === 1.0 && object.geometry) {
      if (object.geometry.boundingSphere === null) {
        object.geometry.computeBoundingSphere();
      }
      
      if (object.geometry.boundingSphere) {
        object.physics.collisionRadius = object.geometry.boundingSphere.radius * 
                                        Math.max(object.scale.x, object.scale.y, object.scale.z);
      }
    }
    
    // Add to physics objects if not already there
    if (!this.physicsObjects.includes(object)) {
      this.physicsObjects.push(object);
      console.log(`Registered physics object: ${object.name || 'unnamed'}`);
    }
    
    return object;
  },
  
  // Remove a physics object
  removeObject(object) {
    const index = this.physicsObjects.indexOf(object);
    if (index !== -1) {
      this.physicsObjects.splice(index, 1);
      console.log(`Removed physics object: ${object.name || 'unnamed'}`);
    }
  },
  
  // Apply force to an object
  applyForce(object, force) {
    if (!object.physics || object.physics.isStatic) return;
    
    // F = ma, so a = F/m
    const acceleration = force.clone().divideScalar(object.physics.mass);
    object.physics.acceleration.add(acceleration);
  },
  
  // Apply impulse to an object (instantaneous change in velocity)
  applyImpulse(object, impulse) {
    if (!object.physics || object.physics.isStatic) return;
    
    // p = mv, so v = p/m
    const deltaVelocity = impulse.clone().divideScalar(object.physics.mass);
    object.physics.velocity.add(deltaVelocity);
  },
  
  // Set velocity directly
  setVelocity(object, velocity) {
    if (!object.physics) return;
    object.physics.velocity.copy(velocity);
  },
  
  // Calculate gravitational force between two objects
  calculateGravitationalForce(obj1, obj2) {
    // Skip if gravity is disabled globally or for either object
    if (!this.settings.enableGravity || 
        !obj1.physics.applyGravity || 
        !obj2.physics.applyGravity) {
      return new THREE.Vector3();
    }
    
    // Get positions
    const pos1 = obj1.position;
    const pos2 = obj2.position;
    
    // Calculate distance
    const distanceVector = new THREE.Vector3().subVectors(pos2, pos1);
    const distance = distanceVector.length();
    
    // Avoid division by zero and limit extreme forces at very close distances
    if (distance < 0.1) return new THREE.Vector3();
    
    // Calculate force magnitude: F = G * (m1 * m2) / r^2
    const forceMagnitude = this.gravitationalConstant * 
                          (obj1.physics.mass * obj2.physics.mass) / 
                          (distance * distance);
    
    // Calculate force direction (normalized distance vector)
    const forceDirection = distanceVector.normalize();
    
    // Return force vector
    return forceDirection.multiplyScalar(forceMagnitude);
  },
  
  // Check for collision between two objects
  checkCollision(obj1, obj2) {
    // Skip if collisions are disabled globally or for either object
    if (!this.settings.enableCollisions || 
        !obj1.physics.applyCollisions || 
        !obj2.physics.applyCollisions) {
      return false;
    }
    
    const distance = obj1.position.distanceTo(obj2.position);
    const minDistance = obj1.physics.collisionRadius + obj2.physics.collisionRadius;
    
    return distance < minDistance;
  },
  
  // Handle collision between two objects
  handleCollision(obj1, obj2) {
    // Simple elastic collision
    if (obj1.physics.isStatic && obj2.physics.isStatic) return;
    
    // Calculate collision normal
    const normal = new THREE.Vector3().subVectors(obj2.position, obj1.position).normalize();
    
    // Calculate relative velocity
    const relativeVelocity = new THREE.Vector3().subVectors(obj2.physics.velocity, obj1.physics.velocity);
    
    // Calculate relative velocity along normal
    const velocityAlongNormal = relativeVelocity.dot(normal);
    
    // If objects are moving away from each other, no collision response needed
    if (velocityAlongNormal > 0) return;
    
    // Calculate restitution (bounciness) - use the minimum of the two objects
    const restitution = Math.min(obj1.physics.restitution || 0.8, obj2.physics.restitution || 0.8);
    
    // Calculate impulse scalar
    let j = -(1 + restitution) * velocityAlongNormal;
    j /= (1 / obj1.physics.mass) + (1 / obj2.physics.mass);
    
    // Apply impulse
    const impulse = normal.clone().multiplyScalar(j);
    
    if (!obj1.physics.isStatic) {
      obj1.physics.velocity.sub(impulse.clone().multiplyScalar(1 / obj1.physics.mass));
    }
    
    if (!obj2.physics.isStatic) {
      obj2.physics.velocity.add(impulse.clone().multiplyScalar(1 / obj2.physics.mass));
    }
    
    // Move objects apart to prevent sticking
    const penetrationDepth = (obj1.physics.collisionRadius + obj2.physics.collisionRadius) - 
                            obj1.position.distanceTo(obj2.position);
    
    const percent = 0.2; // Penetration resolution percentage
    const correction = normal.clone().multiplyScalar(penetrationDepth * percent);
    
    if (!obj1.physics.isStatic) {
      obj1.position.sub(correction.clone().multiplyScalar(obj2.physics.mass / (obj1.physics.mass + obj2.physics.mass)));
    }
    
    if (!obj2.physics.isStatic) {
      obj2.position.add(correction.clone().multiplyScalar(obj1.physics.mass / (obj1.physics.mass + obj2.physics.mass)));
    }
    
    // Apply friction
    // Calculate tangent vector
    const tangent = relativeVelocity.clone()
      .sub(normal.clone().multiplyScalar(relativeVelocity.dot(normal)))
      .normalize();
    
    // Calculate friction impulse scalar
    const friction = Math.min(obj1.physics.friction || 0.1, obj2.physics.friction || 0.1);
    let jt = -relativeVelocity.dot(tangent) * friction;
    jt /= (1 / obj1.physics.mass) + (1 / obj2.physics.mass);
    
    // Apply friction impulse
    const frictionImpulse = tangent.clone().multiplyScalar(jt);
    
    if (!obj1.physics.isStatic) {
      obj1.physics.velocity.sub(frictionImpulse.clone().multiplyScalar(1 / obj1.physics.mass));
    }
    
    if (!obj2.physics.isStatic) {
      obj2.physics.velocity.add(frictionImpulse.clone().multiplyScalar(1 / obj2.physics.mass));
    }
  },
  
  // Update debug visualization
  updateDebugVisualization() {
    // Clear previous debug lines
    this.debugLines.forEach(line => this.debugGroup.remove(line));
    this.debugLines = [];
    
    // Create new debug lines for velocities
    this.physicsObjects.forEach(obj => {
      if (obj.physics.isStatic) return;
      
      // Velocity vector
      const velocityLine = this.createLine(
        obj.position,
        obj.position.clone().add(obj.physics.velocity.clone().multiplyScalar(10)),
        0x00ff00
      );
      
      // Acceleration vector
      const accelerationLine = this.createLine(
        obj.position,
        obj.position.clone().add(obj.physics.acceleration.clone().multiplyScalar(100)),
        0xff0000
      );
      
      // Collision radius visualization
      const collisionSphere = new THREE.Mesh(
        new THREE.SphereGeometry(obj.physics.collisionRadius, 16, 16),
        new THREE.MeshBasicMaterial({ 
          color: 0x0088ff, 
          wireframe: true, 
          transparent: true, 
          opacity: 0.2 
        })
      );
      collisionSphere.position.copy(obj.position);
      
      this.debugLines.push(velocityLine, accelerationLine, collisionSphere);
      this.debugGroup.add(velocityLine, accelerationLine, collisionSphere);
    });
  },
  
  // Create a line for debug visualization
  createLine(from, to, color) {
    const geometry = new THREE.BufferGeometry().setFromPoints([from, to]);
    const material = new THREE.LineBasicMaterial({ color });
    return new THREE.Line(geometry, material);
  },
  
  // Apply velocity damping
  applyDamping(object, deltaTime) {
    if (!object.physics || object.physics.isStatic) return;
    
    // Apply damping factor
    const damping = Math.pow(1 - this.settings.damping, deltaTime);
    object.physics.velocity.multiplyScalar(damping);
    
    // Stop very slow objects
    if (object.physics.velocity.lengthSq() < 0.01) {
      object.physics.velocity.set(0, 0, 0);
    }
  },
  
  // Limit velocity to maximum
  limitVelocity(object) {
    if (!object.physics || object.physics.isStatic) return;
    
    const velocityLength = object.physics.velocity.length();
    if (velocityLength > this.settings.maxVelocity) {
      object.physics.velocity.multiplyScalar(this.settings.maxVelocity / velocityLength);
    }
  },
  
  // Update system
  update(deltaTime, engine) {
    // Scale delta time
    const scaledDelta = deltaTime * this.timeScale;
    
    // Calculate forces and accelerations
    for (let i = 0; i < this.physicsObjects.length; i++) {
      const obj1 = this.physicsObjects[i];
      
      // Skip static objects for force calculations
      if (obj1.physics.isStatic) continue;
      
      // Reset acceleration
      obj1.physics.acceleration.set(0, 0, 0);
      
      // Calculate gravitational forces from all other objects
      for (let j = 0; j < this.physicsObjects.length; j++) {
        if (i === j) continue;
        
        const obj2 = this.physicsObjects[j];
        
        // Apply gravitational force if enabled
        if (this.settings.enableGravity && obj1.physics.applyGravity && obj2.physics.mass > 0) {
          const force = this.calculateGravitationalForce(obj1, obj2);
          const acceleration = force.divideScalar(obj1.physics.mass);
          obj1.physics.acceleration.add(acceleration);
        }
      }
    }
    
    // Update velocities and positions
    for (let i = 0; i < this.physicsObjects.length; i++) {
      const obj = this.physicsObjects[i];
      
      // Skip static objects for movement
      if (obj.physics.isStatic) continue;
      
      // Update velocity using acceleration (v = v + a*t)
      obj.physics.velocity.add(obj.physics.acceleration.clone().multiplyScalar(scaledDelta));
      
      // Apply damping
      this.applyDamping(obj, scaledDelta);
      
      // Limit velocity
      this.limitVelocity(obj);
      
      // Update position using velocity (p = p + v*t)
      obj.position.add(obj.physics.velocity.clone().multiplyScalar(scaledDelta));
    }
    
    // Solve constraints multiple times for better stability
    for (let iteration = 0; iteration < this.settings.solverIterations; iteration++) {
      // Check for collisions
      for (let i = 0; i < this.physicsObjects.length; i++) {
        for (let j = i + 1; j < this.physicsObjects.length; j++) {
          const obj1 = this.physicsObjects[i];
          const obj2 = this.physicsObjects[j];
          
          if (this.checkCollision(obj1, obj2)) {
            this.handleCollision(obj1, obj2);
            
            // Emit collision event if objects have onCollision handlers
            if (obj1.onCollision) obj1.onCollision(obj2);
            if (obj2.onCollision) obj2.onCollision(obj1);
          }
        }
      }
    }
    
    // Update debug visualization if enabled
    if (this.debugMode) {
      this.updateDebugVisualization();
    }
  }
}; 