/**
 * Camera Controls UI
 * Provides on-screen buttons for camera movement in free mode
 */
import * as THREE from 'three';

export const createCameraControls = (engine) => {
  // Get the UI container
  const uiContainer = document.getElementById('ui-container');
  if (!uiContainer) return;
  
  // Make UI container receive pointer events
  uiContainer.style.pointerEvents = 'auto';
  
  // Create camera controls container
  const controlsContainer = document.createElement('div');
  controlsContainer.id = 'camera-controls';
  controlsContainer.className = 'control-panel';
  
  // Create movement controls
  const movementControls = document.createElement('div');
  movementControls.className = 'movement-controls';
  
  // Create directional buttons
  const createButton = (label, action, className) => {
    const button = document.createElement('button');
    button.textContent = label;
    button.className = className;
    
    // Add event listeners
    button.addEventListener('mousedown', (e) => {
      e.preventDefault();
      action(true);
    });
    
    button.addEventListener('touchstart', (e) => {
      e.preventDefault();
      action(true);
    });
    
    button.addEventListener('mouseup', () => action(false));
    button.addEventListener('mouseleave', () => action(false));
    button.addEventListener('touchend', () => action(false));
    
    return button;
  };
  
  // Get camera system
  const cameraSystem = engine.getSystem('camera');
  if (!cameraSystem) return;
  
  // Movement state
  const movementState = {
    forward: false,
    backward: false,
    left: false,
    right: false,
    up: false,
    down: false
  };
  
  // Create movement buttons
  const forwardBtn = createButton('↑', (active) => { movementState.forward = active; }, 'control-btn forward-btn');
  const backwardBtn = createButton('↓', (active) => { movementState.backward = active; }, 'control-btn backward-btn');
  const leftBtn = createButton('←', (active) => { movementState.left = active; }, 'control-btn left-btn');
  const rightBtn = createButton('→', (active) => { movementState.right = active; }, 'control-btn right-btn');
  const upBtn = createButton('⬆', (active) => { movementState.up = active; }, 'control-btn up-btn');
  const downBtn = createButton('⬇', (active) => { movementState.down = active; }, 'control-btn down-btn');
  
  // Create speed control button
  const speedBtn = createButton('Speed', () => {
    // Cycle through speed presets: normal -> fast -> super fast -> normal
    if (cameraSystem.moveSpeed <= 30) {
      cameraSystem.moveSpeed = 60;
      speedBtn.textContent = 'Speed: Fast';
    } else if (cameraSystem.moveSpeed <= 60) {
      cameraSystem.moveSpeed = 120;
      speedBtn.textContent = 'Speed: Turbo';
    } else {
      cameraSystem.moveSpeed = 30;
      speedBtn.textContent = 'Speed: Normal';
    }
  }, 'control-btn speed-btn');
  
  speedBtn.textContent = 'Speed: Normal';
  
  // Arrange buttons in a grid
  const movementGrid = document.createElement('div');
  movementGrid.className = 'movement-grid';
  
  // Top row
  const topRow = document.createElement('div');
  topRow.className = 'control-row';
  topRow.appendChild(upBtn);
  topRow.appendChild(forwardBtn);
  movementGrid.appendChild(topRow);
  
  // Middle row
  const middleRow = document.createElement('div');
  middleRow.className = 'control-row';
  middleRow.appendChild(leftBtn);
  middleRow.appendChild(speedBtn);
  middleRow.appendChild(rightBtn);
  movementGrid.appendChild(middleRow);
  
  // Bottom row
  const bottomRow = document.createElement('div');
  bottomRow.className = 'control-row';
  bottomRow.appendChild(downBtn);
  bottomRow.appendChild(backwardBtn);
  movementGrid.appendChild(bottomRow);
  
  movementControls.appendChild(movementGrid);
  controlsContainer.appendChild(movementControls);
  
  // Add to UI container
  uiContainer.appendChild(controlsContainer);
  
  // Update function to be called in animation loop
  const update = (deltaTime) => {
    const moveSpeed = cameraSystem.moveSpeed;
    
    // Create direction vector
    let dirX = 0, dirY = 0, dirZ = 0;
    
    // Apply movement based on button states
    if (movementState.forward) dirZ = -1;
    if (movementState.backward) dirZ = 1;
    if (movementState.left) dirX = -1;
    if (movementState.right) dirX = 1;
    if (movementState.up) dirY = 1;
    if (movementState.down) dirY = -1;
    
    // Apply movement if any direction is active
    if (dirX !== 0 || dirY !== 0 || dirZ !== 0) {
      // Create direction vector
      const direction = new THREE.Vector3(dirX, dirY, dirZ);
      
      // Normalize if needed
      if (direction.length() > 1) {
        direction.normalize();
      }
      
      // Apply direction relative to camera orientation
      direction.applyQuaternion(cameraSystem.camera.quaternion);
      
      // Update physics velocity if physics system is active
      if (cameraSystem.camera.physics) {
        const velocity = new THREE.Vector3().copy(direction).multiplyScalar(moveSpeed * 3);
        cameraSystem.camera.physics.velocity.copy(velocity);
      } else {
        const movement = new THREE.Vector3().copy(direction).multiplyScalar(moveSpeed * deltaTime * 60);
        cameraSystem.camera.position.add(movement);
      }
    }
  };
  
  // Return the update function
  return { update };
}; 