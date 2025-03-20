/**
 * RTS Game Engine Core
 * Handles the main game loop, scene management, and rendering
 */
import * as THREE from 'three';
import { EventEmitter } from './eventEmitter.js';

export class GameEngine {
  constructor(config = {}) {
    // Configuration with defaults
    this.config = {
      width: config.width || window.innerWidth,
      height: config.height || window.innerHeight,
      backgroundColor: config.backgroundColor || 0x000000,
      parentElement: config.parentElement || document.body,
      ...config
    };
    
    // Core properties
    this.scene = new THREE.Scene();
    this.camera = this.createCamera();
    this.renderer = this.createRenderer();
    this.clock = new THREE.Clock();
    this.events = new EventEmitter();
    this.isRunning = false;
    
    // Game state
    this.entities = new Map();
    this.systems = new Map();
    
    // Add this to the GameEngine class constructor or init method
    this.cameraSystem = null;
    
    // Initialize
    this.init();
  }
  
  init() {
    // Set up scene
    this.scene.background = new THREE.Color(0x010103);
    
    // Add renderer to DOM
    this.config.parentElement.appendChild(this.renderer.domElement);
    
    // Handle window resize
    window.addEventListener('resize', () => this.resize());
  }
  
  createCamera() {
    // Create orthographic camera for 2D
    const aspectRatio = this.config.width / this.config.height;
    const viewSize = 1000;
    const camera = new THREE.OrthographicCamera(
      -viewSize * aspectRatio / 2,
      viewSize * aspectRatio / 2,
      viewSize / 2,
      -viewSize / 2,
      1,
      1000
    );
    camera.position.z = 10;
    return camera;
  }
  
  createRenderer() {
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(this.config.width, this.config.height);
    return renderer;
  }
  
  resize(width = window.innerWidth, height = window.innerHeight) {
    this.config.width = width;
    this.config.height = height;
    
    // Update camera
    const aspectRatio = width / height;
    const viewSize = 1000;
    this.camera.left = -viewSize * aspectRatio / 2;
    this.camera.right = viewSize * aspectRatio / 2;
    this.camera.top = viewSize / 2;
    this.camera.bottom = -viewSize / 2;
    this.camera.updateProjectionMatrix();
    
    // Update renderer
    this.renderer.setSize(width, height);
  }
  
  start() {
    if (this.isRunning) return;
    
    this.isRunning = true;
    this.clock.start();
    this.events.emit('gameStart');
    this.update();
  }
  
  stop() {
    this.isRunning = false;
    this.clock.stop();
    this.events.emit('gameStop');
  }
  
  update() {
    if (!this.isRunning) return;
    
    // Calculate delta time
    const deltaTime = this.clock.getDelta();
    
    // Update all systems
    for (const system of this.systems.values()) {
      system.update(deltaTime, this);
    }
    
    // Render scene
    this.renderer.render(this.scene, this.camera);
    
    // Continue game loop
    requestAnimationFrame(() => this.update());
  }
  
  // Entity management
  addEntity(entity) {
    this.entities.set(entity.id, entity);
    
    // Add to scene if it has a mesh
    if (entity.mesh) {
      this.scene.add(entity.mesh);
    }
    
    this.events.emit('entityAdded', entity);
    return entity;
  }
  
  removeEntity(entityId) {
    const entity = this.entities.get(entityId);
    if (!entity) return false;
    
    // Remove from scene if it has a mesh
    if (entity.mesh) {
      this.scene.remove(entity.mesh);
    }
    
    this.entities.delete(entityId);
    this.events.emit('entityRemoved', entity);
    return true;
  }
  
  getEntity(entityId) {
    return this.entities.get(entityId);
  }
  
  // System management
  addSystem(system) {
    this.systems.set(system.name, system);
    
    // Store reference to camera system
    if (system.name === 'camera') {
      this.cameraSystem = system;
    }
    
    // Initialize the system
    if (typeof system.init === 'function') {
      system.init(this);
    }
    
    this.events.emit('systemAdded', system);
    return system;
  }
  
  removeSystem(systemName) {
    const system = this.systems.get(systemName);
    if (!system) return false;
    
    this.systems.delete(systemName);
    this.events.emit('systemRemoved', system);
    return true;
  }
  
  getSystem(systemName) {
    return this.systems.get(systemName);
  }
} 