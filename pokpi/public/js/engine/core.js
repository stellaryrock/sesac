/**
 * Space Travel Game Engine
 * A modular game engine built with Three.js for space exploration games
 */
import * as THREE from 'three';

export class GameEngine {
  constructor(options = {}) {
    // Default options
    this.options = {
      parentElement: document.body,
      backgroundColor: 0x000000,
      ...options
    };
    
    // Initialize properties
    this.systems = [];
    this.entities = [];
    this.customUpdates = [];
    this.scene = new THREE.Scene();
    this.clock = new THREE.Clock();
    this.isRunning = false;
    
    // Create renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(this.options.backgroundColor);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    
    // Add to DOM
    this.options.parentElement.appendChild(this.renderer.domElement);
    
    // Initialize physics properties
    this.physicsEnabled = false;
    this.physicsEntities = [];
  }
  
  // Add a custom update function
  addCustomUpdate(updateFn) {
    if (typeof updateFn === 'function') {
      this.customUpdates.push(updateFn);
    }
    return this;
  }
  
  // Remove a custom update function
  removeCustomUpdate(updateFn) {
    const index = this.customUpdates.indexOf(updateFn);
    if (index !== -1) {
      this.customUpdates.splice(index, 1);
    }
    return this;
  }
  
  // Add a system to the engine
  addSystem(system) {
    this.systems.push(system);
    
    // Initialize the system
    if (system.init) {
      system.init(this);
    }
    
    // Check if this is a physics system
    if (system.name === 'physics') {
      this.physicsEnabled = true;
      console.log('Physics system enabled');
    }
    
    return system;
  }
  
  // Get a system by name
  getSystem(name) {
    return this.systems.find(system => system.name === name);
  }
  
  // Add an entity to the engine
  addEntity(entity) {
    this.entities.push(entity);
    
    // Add to scene if it's a THREE.Object3D
    if (entity instanceof THREE.Object3D) {
      this.scene.add(entity);
    }
    
    // Register with physics system if available and entity has physics component
    if (this.physicsEnabled && entity.physics) {
      const physicsSystem = this.getSystem('physics');
      if (physicsSystem) {
        physicsSystem.registerObject(entity);
      }
    }
    
    return entity;
  }
  
  // Remove an entity from the engine
  removeEntity(entity) {
    const index = this.entities.indexOf(entity);
    if (index !== -1) {
      this.entities.splice(index, 1);
      
      // Remove from scene if it's a THREE.Object3D
      if (entity instanceof THREE.Object3D) {
        this.scene.remove(entity);
      }
      
      // Unregister from physics system if available
      if (this.physicsEnabled && entity.physics) {
        const physicsSystem = this.getSystem('physics');
        if (physicsSystem) {
          physicsSystem.removeObject(entity);
        }
      }
    }
    
    return entity;
  }
  
  // Create a physics-enabled entity
  createPhysicsEntity(options = {}) {
    // Default options
    const config = {
      geometry: new THREE.BoxGeometry(1, 1, 1),
      material: new THREE.MeshBasicMaterial({ color: 0xffffff }),
      position: new THREE.Vector3(0, 0, 0),
      mass: 1.0,
      isStatic: false,
      collisionRadius: 1.0,
      ...options
    };
    
    // Create mesh
    const entity = new THREE.Mesh(config.geometry, config.material);
    entity.position.copy(config.position);
    
    // Add physics component
    entity.physics = {
      mass: config.mass,
      velocity: new THREE.Vector3(0, 0, 0),
      acceleration: new THREE.Vector3(0, 0, 0),
      isStatic: config.isStatic,
      collisionRadius: config.collisionRadius,
      applyGravity: true,
      applyCollisions: true
    };
    
    // Add to engine
    this.addEntity(entity);
    
    return entity;
  }
  
  // Handle window resize
  handleResize() {
    if (this.camera) {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    }
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
  
  // Start the game loop
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.clock.start();
    this.animate();
    
    console.log('Game engine started');
  }
  
  // Stop the game loop
  stop() {
    this.isRunning = false;
    this.clock.stop();
    
    console.log('Game engine stopped');
  }
  
  // Animation loop
  animate() {
    if (!this.isRunning) return;
    
    // Request next frame
    requestAnimationFrame(() => this.animate());
    
    // Calculate delta time
    const deltaTime = this.clock.getDelta();
    
    // Update all systems
    for (const system of this.systems) {
      if (system.update) {
        system.update(deltaTime, this);
      }
    }
    
    // Run custom update functions
    for (const updateFn of this.customUpdates) {
      updateFn(deltaTime, this);
    }
    
    // Render the scene
    if (this.camera) {
      this.renderer.render(this.scene, this.camera);
    }
  }
} 