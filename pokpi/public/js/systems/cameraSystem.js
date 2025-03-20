/**
 * Camera System
 * Handles camera movement and interaction in free mode only
 */
import * as THREE from 'three';

export const cameraSystem = {
  name: 'camera',
  
  // Camera state
  mode: 'free', // Only free mode now
  distance: 1000,
  rotationSpeed: 0.01, // Increased rotation speed
  moveSpeed: 30,
  zoomSpeed: 0.1,
  collisionRadius: 50, // Collision radius for the camera
  
  // Mouse state
  isDragging: false,
  previousMousePosition: { x: 0, y: 0 },
  dragStartTime: 0,
  dragThreshold: 5, // Pixels of movement to consider a drag vs a click
  
  // Initialize the system
  init(engine) {
    this.engine = engine;
    
    // Create camera
    const camera = new THREE.PerspectiveCamera(
      75, 
      window.innerWidth / window.innerHeight, 
      0.1, 
      10000
    );
    
    // Set initial position
    camera.position.set(0, 500, 1500);
    camera.lookAt(0, 0, 0);
    
    // Store camera
    this.camera = camera;
    engine.camera = camera;
    
    // Register camera with physics system if available
    const physicsSystem = engine.getSystem('physics');
    if (physicsSystem) {
      physicsSystem.registerObject(camera);
      
      // Set physics properties
      camera.physics.mass = 100;
      camera.physics.collisionRadius = this.collisionRadius;
      camera.physics.isStatic = false;
      camera.physics.applyGravity = false; // Camera shouldn't be affected by gravity
      
      // Custom collision handler
      camera.onCollision = (other) => this.handleCameraCollision(other);
    }
    
    // Set up event listeners
    this.setupEventListeners();
    
    console.log('Camera system initialized in free mode');
  },
  
  // Set up event listeners
  setupEventListeners() {
    const canvas = this.engine.renderer.domElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
    window.addEventListener('mousemove', (e) => this.onMouseMove(e));
    window.addEventListener('mouseup', (e) => this.onMouseUp(e));
    canvas.addEventListener('wheel', (e) => this.onMouseWheel(e));
    
    // Touch events for mobile
    canvas.addEventListener('touchstart', (e) => this.onTouchStart(e));
    canvas.addEventListener('touchmove', (e) => this.onTouchMove(e));
    canvas.addEventListener('touchend', (e) => this.onTouchEnd(e));
    
    // Keyboard events
    window.addEventListener('keydown', (e) => this.onKeyDown(e));
    
    // Prevent context menu
    canvas.addEventListener('contextmenu', (e) => {
      e.preventDefault();
    });
  },
  
  // Handle camera collision with other objects
  handleCameraCollision(other) {
    // Check if we collided with a planet
    const spaceSystem = this.engine.getSystem('space');
    if (spaceSystem && spaceSystem.entities.planets) {
      const planets = Array.isArray(spaceSystem.entities.planets) 
        ? spaceSystem.entities.planets 
        : [spaceSystem.entities.planets];
      
      if (planets.includes(other)) {
        console.log('Camera collided with a planet!');
        
        // Create a bounce effect
        const bounceDirection = new THREE.Vector3()
          .subVectors(this.camera.position, other.position)
          .normalize();
        
        // Apply bounce force
        this.camera.physics.velocity.copy(bounceDirection.multiplyScalar(40));
      }
    }
  },
  
  // Mouse down event
  onMouseDown(event) {
    // Both left and right mouse buttons can be used for dragging
    this.isDragging = true;
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    // Log for debugging
    console.log('Mouse down, dragging started');
    
  },
  
  // Touch start event
  onTouchStart(event) {
    if (event.touches.length === 1) {
      event.preventDefault();
      this.isDragging = true;
      
      const touch = event.touches[0];
      this.previousMousePosition = {
        x: touch.clientX,
        y: touch.clientY
      };
      
      // Log for debugging
      console.log('Touch start, dragging started');
    }
  },
  
  // Mouse move event
  onMouseMove(event) {
    if (!this.isDragging) return;
    
    // Calculate movement delta
    const deltaX = event.clientX - this.previousMousePosition.x;
    const deltaY = event.clientY - this.previousMousePosition.y;
    
    // Update rotation directly
    this.camera.rotation.y -= deltaX * this.rotationSpeed;
    this.camera.rotation.x -= deltaY * this.rotationSpeed;
    
    // Limit vertical rotation to avoid flipping
    this.camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.camera.rotation.x));
    
    // Update previous position
    this.previousMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    // Log for debugging
    console.log(`Camera rotated: deltaX=${deltaX}, deltaY=${deltaY}, rotation=(${this.camera.rotation.x.toFixed(2)}, ${this.camera.rotation.y.toFixed(2)})`);
  },
  
  // Touch move event
  onTouchMove(event) {
    if (!this.isDragging || event.touches.length !== 1) return;
    
    event.preventDefault();
    const touch = event.touches[0];
    
    // Calculate movement delta
    const deltaX = touch.clientX - this.previousMousePosition.x;
    const deltaY = touch.clientY - this.previousMousePosition.y;
    
    // Update rotation directly
    this.camera.rotation.y -= deltaX * this.rotationSpeed;
    this.camera.rotation.x -= deltaY * this.rotationSpeed;
    
    // Limit vertical rotation to avoid flipping
    this.camera.rotation.x = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.camera.rotation.x));
    
    // Update previous position
    this.previousMousePosition = {
      x: touch.clientX,
      y: touch.clientY
    };
  },
  
  // Mouse up event
  onMouseUp(event) {
    if (this.isDragging) {
      this.isDragging = false;
      console.log('Mouse up, dragging ended');
    }
  },
  
  // Touch end event
  onTouchEnd(event) {
    this.isDragging = false;
    console.log('Touch end, dragging ended');
  },
  
  // Mouse wheel event
  onMouseWheel(event) {
    event.preventDefault();
    
    // Zoom factor
    const zoomFactor = event.deltaY > 0 ? 1 + this.zoomSpeed : 1 - this.zoomSpeed;
    
    // Adjust move speed in free mode
    this.moveSpeed = Math.max(5, Math.min(100, this.moveSpeed * zoomFactor));
    console.log(`Camera speed: ${this.moveSpeed.toFixed(1)}`);
  },
  
  // Keyboard event
  onKeyDown(event) {
    const moveSpeed = this.moveSpeed;
    const direction = new THREE.Vector3();
    
    // Forward/backward
    if (event.key === 'w' || event.key === 'W') {
      direction.z = -1;
    } else if (event.key === 's' || event.key === 'S') {
      direction.z = 1;
    }
    
    // Left/right
    if (event.key === 'a' || event.key === 'A') {
      direction.x = -1;
    } else if (event.key === 'd' || event.key === 'D') {
      direction.x = 1;
    }
    
    // Up/down
    if (event.key === 'q' || event.key === 'Q') {
      direction.y = -1;
    } else if (event.key === 'e' || event.key === 'E') {
      direction.y = 1;
    }
    
    // Apply movement
    if (direction.length() > 0) {
      direction.normalize();
      
      // Apply direction relative to camera orientation
      direction.applyQuaternion(this.camera.quaternion);
      
      // Update physics velocity if physics system is active
      if (this.camera.physics) {
        this.camera.physics.velocity.copy(direction.multiplyScalar(moveSpeed * 3));
      } else {
        this.camera.position.add(direction.multiplyScalar(moveSpeed));
      }
    }
  },
  
  // Update system
  update(deltaTime, engine) {
    // Apply damping to camera velocity if using physics
    if (this.camera.physics && this.camera.physics.velocity) {
      // Apply damping only if not actively moving
      const isMoving = this.camera.physics.velocity.lengthSq() > 0.01;
      if (isMoving) {
        // Apply slight damping to make movement smoother
        this.camera.physics.velocity.multiplyScalar(0.95);
      }
    }
  }
}; 