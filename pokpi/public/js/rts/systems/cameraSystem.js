/**
 * Camera System
 * Handles camera movement, zooming, and controls
 */
import * as THREE from 'three';

// Camera system for RTS game
export const cameraSystem = {
  name: 'camera',
  
  // System state
  isDragging: false,
  lastMousePosition: { x: 0, y: 0 },
  zoomLevel: 1,
  minZoom: 0.5,
  maxZoom: 2.5,
  panSpeed: 1.2,
  zoomSpeed: 0.1,
  edgeScrollThreshold: 20,
  edgeScrollSpeed: 0.8,
  boundarySize: 1000, // Maximum distance from center
  
  // Initialize the system
  init(engine) {
    console.log('Initializing camera system');
    
    // Set initial camera position
    engine.camera.position.set(0, 0, 1000);
    engine.camera.lookAt(0, 0, 0);
    
    // Store original camera settings
    this.originalZ = engine.camera.position.z;
    this.originalLeft = engine.camera.left;
    this.originalRight = engine.camera.right;
    this.originalTop = engine.camera.top;
    this.originalBottom = engine.camera.bottom;
    
    // Add event listeners
    const container = engine.config.parentElement;
    
    // Mouse wheel for zooming
    container.addEventListener('wheel', (event) => {
      event.preventDefault();
      this.handleZoom(event, engine);
    });
    
    // Middle mouse button or right mouse button for panning
    container.addEventListener('mousedown', (event) => {
      // Use left mouse button (0) when not placing buildings
      if (event.button === 0 && (!engine.buildingSystem || !engine.buildingSystem.isPlacingBuilding)) {
        event.preventDefault();
        this.startDrag(event);
      }
      // Always allow middle (1) or right (2) mouse button for panning
      else if (event.button === 1 || event.button === 2) {
        event.preventDefault();
        this.startDrag(event);
      }
    });
    
    // Make sure we track mouse movement for dragging
    window.addEventListener('mousemove', (event) => {
      this.handleMouseMove(event, engine);
    });
    
    // And handle mouse up to end dragging
    window.addEventListener('mouseup', (event) => {
      if (event.button === 0 || event.button === 1 || event.button === 2) {
        this.endDrag();
      }
    });
    
    container.addEventListener('mouseleave', () => {
      this.endDrag();
    });
    
    // Keyboard controls
    document.addEventListener('keydown', (event) => {
      this.handleKeyDown(event, engine);
    });
    
    // Prevent context menu on right-click
    container.addEventListener('contextmenu', (event) => {
      if (!engine.buildingSystem || !engine.buildingSystem.isPlacingBuilding) {
        event.preventDefault();
      }
    });
    
    // Add touch support for mobile
    container.addEventListener('touchstart', (event) => {
      if (event.touches.length === 2) {
        // Two finger touch for zooming
        this.handleTouchStart(event);
      } else if (event.touches.length === 1) {
        // Single finger touch for panning
        this.startDrag({
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY
        });
      }
    });
    
    container.addEventListener('touchmove', (event) => {
      if (event.touches.length === 2) {
        // Two finger touch for zooming
        this.handleTouchMove(event, engine);
      } else if (event.touches.length === 1 && this.isDragging) {
        // Single finger touch for panning
        this.handleDrag({
          clientX: event.touches[0].clientX,
          clientY: event.touches[0].clientY
        }, engine);
      }
      
      // Prevent page scrolling
      event.preventDefault();
    });
    
    container.addEventListener('touchend', () => {
      this.endDrag();
      this.lastTouchDistance = null;
    });
  },
  
  // Start camera drag
  startDrag(event) {
    this.isDragging = true;
    this.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
  },
  
  // Handle camera drag
  handleDrag(event, engine) {
    if (!this.isDragging) return;
    
    // Calculate mouse movement
    const deltaX = event.clientX - this.lastMousePosition.x;
    const deltaY = event.clientY - this.lastMousePosition.y;
    
    // Update last position
    this.lastMousePosition = {
      x: event.clientX,
      y: event.clientY
    };
    
    // Move camera in opposite direction of mouse movement
    this.moveCamera(-deltaX * this.panSpeed, deltaY * this.panSpeed, engine);
  },
  
  // End camera drag
  endDrag() {
    this.isDragging = false;
  },
  
  // Handle mouse wheel zoom
  handleZoom(event, engine) {
    // Determine zoom direction (normalize across browsers)
    const zoomDirection = Math.sign(event.deltaY);
    const zoomAmount = zoomDirection * this.zoomSpeed;
    
    // Calculate new zoom level
    const newZoomLevel = Math.max(
      this.minZoom,
      Math.min(this.maxZoom, this.zoomLevel + zoomAmount)
    );
    
    // If zoom level didn't change, exit early
    if (newZoomLevel === this.zoomLevel) return;
    
    // Get mouse position in world coordinates before zoom
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    const rect = engine.renderer.domElement.getBoundingClientRect();
    
    // Convert to normalized device coordinates
    const ndcX = ((mouseX - rect.left) / rect.width) * 2 - 1;
    const ndcY = -((mouseY - rect.top) / rect.height) * 2 + 1;
    
    // Convert to world coordinates
    const mouse3D = new THREE.Vector3(ndcX, ndcY, 0);
    mouse3D.unproject(engine.camera);
    
    // Store world point under mouse
    const worldPoint = {
      x: mouse3D.x,
      y: mouse3D.y
    };
    
    // Apply zoom
    const zoomFactor = newZoomLevel / this.zoomLevel;
    this.zoomLevel = newZoomLevel;
    
    // For orthographic camera, adjust the camera's projection matrix
    const camera = engine.camera;
    const originalWidth = (camera.right - camera.left);
    const originalHeight = (camera.top - camera.bottom);
    
    const newWidth = originalWidth / zoomFactor;
    const newHeight = originalHeight / zoomFactor;
    
    camera.left = -newWidth / 2;
    camera.right = newWidth / 2;
    camera.top = newHeight / 2;
    camera.bottom = -newHeight / 2;
    camera.updateProjectionMatrix();
    
    // After zooming, the world point under the mouse should remain the same
    // Get new world point under mouse after zoom
    const newMouse3D = new THREE.Vector3(ndcX, ndcY, 0);
    newMouse3D.unproject(engine.camera);
    
    // Calculate the difference
    const deltaX = worldPoint.x - newMouse3D.x;
    const deltaY = worldPoint.y - newMouse3D.y;
    
    // Adjust camera position to keep mouse over the same world point
    camera.position.x += deltaX;
    camera.position.y += deltaY;
    
    // Enforce boundaries
    this.enforceBoundaries(engine);
    
    // Log zoom level for debugging
    console.log('Zoom level:', this.zoomLevel, 'Camera zoom:', camera.zoom);
  },
  
  // Handle touch zoom
  handleTouchStart(event) {
    if (event.touches.length !== 2) return;
    
    // Calculate initial distance between touch points
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    this.lastTouchDistance = Math.sqrt(dx * dx + dy * dy);
  },
  
  // Handle touch move for zooming
  handleTouchMove(event, engine) {
    if (event.touches.length !== 2 || !this.lastTouchDistance) return;
    
    // Calculate new distance between touch points
    const dx = event.touches[0].clientX - event.touches[1].clientX;
    const dy = event.touches[0].clientY - event.touches[1].clientY;
    const newDistance = Math.sqrt(dx * dx + dy * dy);
    
    // Calculate zoom amount based on pinch gesture
    const zoomDelta = (this.lastTouchDistance - newDistance) * 0.01;
    
    // Create a synthetic wheel event at the center of the pinch
    const centerX = (event.touches[0].clientX + event.touches[1].clientX) / 2;
    const centerY = (event.touches[0].clientY + event.touches[1].clientY) / 2;
    
    this.handleZoom({
      deltaY: zoomDelta * 100,
      clientX: centerX,
      clientY: centerY
    }, engine);
    
    // Update last distance
    this.lastTouchDistance = newDistance;
  },
  
  // Handle mouse movement for edge scrolling and dragging
  handleMouseMove(event, engine) {
    // Handle dragging
    if (this.isDragging) {
      this.handleDrag(event, engine);
      return;
    }
    
    // Handle edge scrolling
    const rect = engine.renderer.domElement.getBoundingClientRect();
    
    // Check if mouse is inside the game container
    if (event.clientX < rect.left || event.clientX > rect.right ||
        event.clientY < rect.top || event.clientY > rect.bottom) {
      return;
    }
    
    // Calculate distance from edges
    const distFromLeft = event.clientX - rect.left;
    const distFromRight = rect.right - event.clientX;
    const distFromTop = event.clientY - rect.top;
    const distFromBottom = rect.bottom - event.clientY;
    
    // Calculate movement based on edge proximity
    let moveX = 0;
    let moveY = 0;
    
    if (distFromLeft < this.edgeScrollThreshold) {
      moveX = -this.edgeScrollSpeed * (1 - distFromLeft / this.edgeScrollThreshold);
    } else if (distFromRight < this.edgeScrollThreshold) {
      moveX = this.edgeScrollSpeed * (1 - distFromRight / this.edgeScrollThreshold);
    }
    
    if (distFromTop < this.edgeScrollThreshold) {
      moveY = -this.edgeScrollSpeed * (1 - distFromTop / this.edgeScrollThreshold);
    } else if (distFromBottom < this.edgeScrollThreshold) {
      moveY = this.edgeScrollSpeed * (1 - distFromBottom / this.edgeScrollThreshold);
    }
    
    // Apply movement if needed
    if (moveX !== 0 || moveY !== 0) {
      this.moveCamera(moveX, moveY, engine);
    }
  },
  
  // Handle keyboard controls
  handleKeyDown(event, engine) {
    let moveX = 0;
    let moveY = 0;
    
    // Arrow keys or WASD
    switch (event.key) {
      case 'ArrowUp':
      case 'w':
      case 'W':
        moveY = -this.panSpeed * 5;
        break;
      case 'ArrowDown':
      case 's':
      case 'S':
        moveY = this.panSpeed * 5;
        break;
      case 'ArrowLeft':
      case 'a':
      case 'A':
        moveX = -this.panSpeed * 5;
        break;
      case 'ArrowRight':
      case 'd':
      case 'D':
        moveX = this.panSpeed * 5;
        break;
      // Zoom controls
      case '+':
      case '=':
        this.handleZoom({ deltaY: -100, clientX: window.innerWidth/2, clientY: window.innerHeight/2 }, engine);
        break;
      case '-':
      case '_':
        this.handleZoom({ deltaY: 100, clientX: window.innerWidth/2, clientY: window.innerHeight/2 }, engine);
        break;
      // Reset view
      case 'Home':
      case 'r':
      case 'R':
        this.resetCamera(engine);
        break;
    }
    
    if (moveX !== 0 || moveY !== 0) {
      this.moveCamera(moveX, moveY, engine);
    }
  },
  
  // Move camera by given amounts
  moveCamera(deltaX, deltaY, engine) {
    // Scale movement by zoom level
    const scaledDeltaX = deltaX / this.zoomLevel;
    const scaledDeltaY = deltaY / this.zoomLevel;
    
    // Update camera position
    engine.camera.position.x += scaledDeltaX;
    engine.camera.position.y += scaledDeltaY;
    
    // Enforce boundaries
    this.enforceBoundaries(engine);
  },
  
  // Reset camera to initial position
  resetCamera(engine) {
    console.log('Resetting camera');
    
    engine.camera.position.x = 0;
    engine.camera.position.y = 0;
    this.zoomLevel = 1;
    
    // Reset orthographic camera parameters
    engine.camera.left = this.originalLeft;
    engine.camera.right = this.originalRight;
    engine.camera.top = this.originalTop;
    engine.camera.bottom = this.originalBottom;
    engine.camera.updateProjectionMatrix();
  },
  
  // Enforce camera boundaries
  enforceBoundaries(engine) {
    // Calculate effective boundary based on zoom
    const effectiveBoundary = this.boundarySize * 0.8;
    
    // Clamp X position
    engine.camera.position.x = Math.max(
      -effectiveBoundary,
      Math.min(effectiveBoundary, engine.camera.position.x)
    );
    
    // Clamp Y position
    engine.camera.position.y = Math.max(
      -effectiveBoundary,
      Math.min(effectiveBoundary, engine.camera.position.y)
    );
  },
  
  // Update system
  update(deltaTime, engine) {
    // Add debug info
    if (engine.frameCount % 60 === 0) {
      console.log('Camera position:', engine.camera.position, 'Zoom level:', this.zoomLevel);
    }
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