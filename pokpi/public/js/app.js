/**
 * Main application entry point
 * Initializes the game engine and systems
 */
import * as THREE from 'three';
import { GameEngine } from './engine/core.js';
import { spaceSystem } from './systems/spaceSystem.js';
import { cameraSystem } from './systems/cameraSystem.js';
import { physicsSystem } from './systems/physicsSystem.js';
import { createCameraControls } from './ui/cameraControls.js';
import { createEntityInfoSystem } from './ui/entityInfo.js';

// Global camera control state
const cameraControls = {
  isDragging: false,
  lastMouseX: 0,
  lastMouseY: 0,
  rotationSpeed: 0.01
};

// Initialize the application
export function initializeApp() {
  // Create game engine
  const engine = new GameEngine({
    parentElement: document.body,
    backgroundColor: 0x000005
  });
  
  // Add systems in order of dependency
  engine.addSystem(physicsSystem);  // Add physics first so other systems can use it
  engine.addSystem(spaceSystem);
  engine.addSystem(cameraSystem);
  
  // Create some additional physics objects for testing
  createPhysicsTestObjects(engine);
  
  // Initialize UI components
  const uiControls = createCameraControls(engine);
  const entityInfoSystem = createEntityInfoSystem(engine);
  
  // Start the game loop
  engine.start();
  
  // Add custom update functions for UI
  if (uiControls && uiControls.update) {
    engine.addCustomUpdate((deltaTime) => {
      uiControls.update(deltaTime);
    });
  }
  
  if (entityInfoSystem && entityInfoSystem.update) {
    engine.addCustomUpdate(() => {
      entityInfoSystem.update();
    });
  }
  
  // Set up global camera rotation controls
  setupGlobalCameraControls(engine);
  
  // Handle window resize
  window.addEventListener('resize', () => engine.handleResize());
  
  // Add keyboard controls for physics settings
  setupPhysicsControls(engine);
  
  // Prevent default touch behavior to avoid scrolling
  document.addEventListener('touchmove', (e) => {
    if (e.target.tagName !== 'BUTTON') {
      e.preventDefault();
    }
  }, { passive: false });
  
  // Clean up on window unload
  window.addEventListener('unload', () => {
    if (entityInfoSystem && entityInfoSystem.dispose) {
      entityInfoSystem.dispose();
    }
  });
  
  // Return the engine instance for potential external access
  return engine;
}

// Set up global camera rotation controls
function setupGlobalCameraControls(engine) {
  const camera = engine.camera;
  if (!camera) return;
  
  console.log('Setting up global camera controls');
  
  // Mouse down event
  document.addEventListener('mousedown', (e) => {
    if (e.button === 0) { // Left mouse button
      cameraControls.isDragging = true;
      cameraControls.lastMouseX = e.clientX;
      cameraControls.lastMouseY = e.clientY;
      console.log('Global mouse down detected');
    }
  });
  
  // Mouse move event
  document.addEventListener('mousemove', (e) => {
    if (cameraControls.isDragging) {
      const deltaX = e.clientX - cameraControls.lastMouseX;
      const deltaY = e.clientY - cameraControls.lastMouseY;
      
      // Apply rotation to camera
      camera.rotation.y -= deltaX * cameraControls.rotationSpeed;
      camera.rotation.x -= deltaY * cameraControls.rotationSpeed;
      
      // Limit vertical rotation
      camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, camera.rotation.x));
      
      // Update last position
      cameraControls.lastMouseX = e.clientX;
      cameraControls.lastMouseY = e.clientY;
      
      console.log(`Global camera rotation: deltaX=${deltaX}, deltaY=${deltaY}, rotation=(${camera.rotation.x.toFixed(2)}, ${camera.rotation.y.toFixed(2)})`);
    }
  });
  
  // Mouse up event
  document.addEventListener('mouseup', () => {
    if (cameraControls.isDragging) {
      cameraControls.isDragging = false;
      console.log('Global mouse up detected');
    }
  });
  
  // Mouse leave event
  document.addEventListener('mouseleave', () => {
    cameraControls.isDragging = false;
  });
}

// Create some physics test objects
function createPhysicsTestObjects(engine) {
  const physicsSystem = engine.getSystem('physics');
  if (!physicsSystem) return;
  
  // Create a few physics objects
  const geometry = new THREE.SphereGeometry(50, 32, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  
  // Create a few physics objects
  for (let i = 0; i < 5; i++) {
    const sphere = new THREE.Mesh(geometry, material);
    sphere.position.set(
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000,
      Math.random() * 2000 - 1000
    );
    
    engine.scene.add(sphere);
    
    // Register with physics system
    physicsSystem.registerObject(sphere);
    
    // Set physics properties
    sphere.physics.mass = 1000;
    sphere.physics.velocity = new THREE.Vector3(
      Math.random() * 2 - 1,
      Math.random() * 2 - 1,
      Math.random() * 2 - 1
    );
    sphere.physics.collisionRadius = 50;
  }
}

// Setup keyboard controls for physics settings
function setupPhysicsControls(engine) {
  window.addEventListener('keydown', (e) => {
    const physicsSystem = engine.getSystem('physics');
    if (!physicsSystem) return;
    
    // Toggle gravity with 'g'
    if (e.key === 'g') {
      physicsSystem.settings.enableGravity = !physicsSystem.settings.enableGravity;
      console.log(`Gravity: ${physicsSystem.settings.enableGravity ? 'ON' : 'OFF'}`);
    }
    
    // Toggle collisions with 'c'
    if (e.key === 'c') {
      physicsSystem.settings.enableCollisions = !physicsSystem.settings.enableCollisions;
      console.log(`Collisions: ${physicsSystem.settings.enableCollisions ? 'ON' : 'OFF'}`);
    }
    
    // Increase gravity with '+'
    if (e.key === '+' || e.key === '=') {
      physicsSystem.gravitationalConstant *= 2;
      console.log(`Gravitational constant: ${physicsSystem.gravitationalConstant}`);
    }
    
    // Decrease gravity with '-'
    if (e.key === '-') {
      physicsSystem.gravitationalConstant /= 2;
      console.log(`Gravitational constant: ${physicsSystem.gravitationalConstant}`);
    }
    
    // Reset physics with 'r'
    if (e.key === 'r') {
      physicsSystem.gravitationalConstant = 6.67430e-11;
      physicsSystem.settings.enableGravity = true;
      physicsSystem.settings.enableCollisions = true;
      console.log('Physics settings reset to defaults');
    }
  });
}

// Auto-initialize when loaded as a module
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApp);
} else {
  initializeApp();
} 