/**
 * Camera System
 * Handles camera movement, rotation, and controls
 */
import * as THREE from 'three';

// Camera system for RTS game
export const cameraSystem = {
  name: 'camera',
  
  // System state
  isDragging: false,
  lastMousePosition: { x: 0, y: 0 },
  targetPosition: new THREE.Vector3(0, 0, 0),
  targetRotation: new THREE.Euler(0, 0, 0),
  cameraDistance: 1000,
  minDistance: 200,
  maxDistance: 2000,
  rotationSpeed: 0.005,
  moveSpeed: 5,
  zoomSpeed: 50,
  
  // Initialize the system
  init(engine) {
    // Set up camera
    this.setupCamera(engine);
    
    // Add event listeners
    this.setupEventListeners(engine);
    
    // Add debug info
    this.setupDebugInfo();
  },
  
  // Set up the camera
  setupCamera(engine) {
    // Create perspective camera
    const camera = new THREE.PerspectiveCamera(
      60, // Field of view
      window.innerWidth / window.innerHeight, // Aspect ratio
      1, // Near clipping plane
      10000 // Far clipping plane
    );
    
    // Set initial position
    camera.position.set(0, 0, this.cameraDistance);
    
    // Look at center
    camera.lookAt(0, 0, 0);
    
    // Store camera in engine
    engine.camera = camera;
    
    // Create camera pivot for orbital movement
    this.cameraPivot = new THREE.Object3D();
    this.cameraPivot.add(camera);
    engine.scene.add(this.cameraPivot);
    
    // Handle window resize
    window.addEventListener('resize', () => {
      engine.camera.aspect = window.innerWidth / window.innerHeight;
      engine.camera.updateProjectionMatrix();
      engine.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  },
  
  // Set up event listeners for camera controls
  setupEventListeners(engine) {
    const container = engine.config.parentElement;
    
    // Mouse controls
    container.addEventListener('mousedown', (event) => {
      if (event.button === 0) { // Left mouse button
        this.isDragging = true;
        this.lastMousePosition.x = event.clientX;
        this.lastMousePosition.y = event.clientY;
      }
    });
    
    container.addEventListener('mousemove', (event) => {
      if (this.isDragging) {
        const deltaX = event.clientX - this.lastMousePosition.x;
        const deltaY = event.clientY - this.lastMousePosition.y;
        
        // Rotate camera based on mouse movement
        this.targetRotation.y -= deltaX * this.rotationSpeed;
        this.targetRotation.x -= deltaY * this.rotationSpeed;
        
        // Limit vertical rotation to prevent flipping
        this.targetRotation.x = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, this.targetRotation.x));
        
        this.lastMousePosition.x = event.clientX;
        this.lastMousePosition.y = event.clientY;
      }
    });
    
    window.addEventListener('mouseup', () => {
      this.isDragging = false;
    });
    
    // Zoom with mouse wheel
    container.addEventListener('wheel', (event) => {
      event.preventDefault();
      
      // Adjust camera distance based on wheel direction
      this.cameraDistance += event.deltaY * this.zoomSpeed / 100;
      
      // Clamp distance
      this.cameraDistance = Math.max(this.minDistance, Math.min(this.maxDistance, this.cameraDistance));
    });
    
    // Keyboard controls
    const keyState = {};
    
    window.addEventListener('keydown', (event) => {
      keyState[event.key.toLowerCase()] = true;
      
      // Reset camera with 'r' key
      if (event.key.toLowerCase() === 'r') {
        this.resetCamera();
      }
    });
    
    window.addEventListener('keyup', (event) => {
      keyState[event.key.toLowerCase()] = false;
    });
    
    // Store key state for update loop
    this.keyState = keyState;
  },
  
  // Set up debug info display
  setupDebugInfo() {
    const debugOverlay = document.getElementById('debug-overlay');
    if (!debugOverlay) return;
    
    // Create camera info element
    const cameraInfo = document.createElement('div');
    cameraInfo.id = 'camera-info';
    debugOverlay.appendChild(cameraInfo);
    
    // Store reference
    this.cameraInfo = cameraInfo;
  },
  
  // Reset camera to default position
  resetCamera() {
    this.targetPosition.set(0, 0, 0);
    this.targetRotation.set(0, 0, 0);
    this.cameraDistance = 1000;
  },
  
  // Update camera position based on keyboard input
  updateCameraPosition(deltaTime) {
    const moveAmount = this.moveSpeed * deltaTime;
    
    // Get forward and right vectors from camera
    const forward = new THREE.Vector3(0, 0, -1).applyEuler(this.cameraPivot.rotation);
    const right = new THREE.Vector3(1, 0, 0).applyEuler(this.cameraPivot.rotation);
    
    // Forward/backward movement (W/S or Arrow Up/Down)
    if (this.keyState['w'] || this.keyState['arrowup']) {
      this.targetPosition.add(forward.clone().multiplyScalar(moveAmount * 10));
    }
    if (this.keyState['s'] || this.keyState['arrowdown']) {
      this.targetPosition.add(forward.clone().multiplyScalar(-moveAmount * 10));
    }
    
    // Left/right movement (A/D or Arrow Left/Right)
    if (this.keyState['a'] || this.keyState['arrowleft']) {
      this.targetPosition.add(right.clone().multiplyScalar(-moveAmount * 10));
    }
    if (this.keyState['d'] || this.keyState['arrowright']) {
      this.targetPosition.add(right.clone().multiplyScalar(moveAmount * 10));
    }
    
    // Up/down movement (Q/E)
    if (this.keyState['q']) {
      this.targetPosition.y += moveAmount * 10;
    }
    if (this.keyState['e']) {
      this.targetPosition.y -= moveAmount * 10;
    }
  },
  
  // Update debug info
  updateDebugInfo(engine) {
    if (!this.cameraInfo) return;
    
    const camera = engine.camera;
    const position = camera.position;
    const rotation = this.cameraPivot.rotation;
    
    this.cameraInfo.innerHTML = `
      <p>Camera:</p>
      <ul>
        <li>Position: X: ${position.x.toFixed(0)}, Y: ${position.y.toFixed(0)}, Z: ${position.z.toFixed(0)}</li>
        <li>Rotation: X: ${(rotation.x * 180 / Math.PI).toFixed(1)}°, Y: ${(rotation.y * 180 / Math.PI).toFixed(1)}°</li>
        <li>Distance: ${this.cameraDistance.toFixed(0)}</li>
      </ul>
    `;
  },
  
  // Update system
  update(deltaTime, engine) {
    // Update camera position based on keyboard input
    this.updateCameraPosition(deltaTime);
    
    // Smoothly interpolate camera pivot rotation
    this.cameraPivot.rotation.x += (this.targetRotation.x - this.cameraPivot.rotation.x) * 0.1;
    this.cameraPivot.rotation.y += (this.targetRotation.y - this.cameraPivot.rotation.y) * 0.1;
    
    // Smoothly interpolate camera pivot position
    this.cameraPivot.position.x += (this.targetPosition.x - this.cameraPivot.position.x) * 0.1;
    this.cameraPivot.position.y += (this.targetPosition.y - this.cameraPivot.position.y) * 0.1;
    this.cameraPivot.position.z += (this.targetPosition.z - this.cameraPivot.position.z) * 0.1;
    
    // Update camera distance (zoom)
    const camera = engine.camera;
    camera.position.z += (this.cameraDistance - camera.position.z) * 0.1;
    
    // Update debug info
    this.updateDebugInfo(engine);
  },
  
  // Add minimap controls
  setupMinimap(minimapElement, engine) {
    if (!minimapElement) return;
    
    minimapElement.addEventListener('click', (event) => {
      // Get click position relative to minimap
      const rect = minimapElement.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      
      // Convert to world coordinates
      const worldX = (x - 0.5) * this.boundarySize * 2;
      const worldY = (y - 0.5) * this.boundarySize * 2;
      
      // Move camera to clicked position
      engine.camera.position.x = worldX;
      engine.camera.position.y = worldY;
      
      // Enforce boundaries
      this.enforceBoundaries(engine);
    });
  }
};

export default cameraSystem; 