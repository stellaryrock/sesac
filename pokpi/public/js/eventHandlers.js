// Event handler functions for keyboard and mouse inputs

/**
 * Handle keyboard key down events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} inputState - The current input state
 * @returns {Object} Updated input state
 */
const handleKeyDown = (event, inputState) => {
  const newInputState = { ...inputState };
  
  if (newInputState.keys.hasOwnProperty(event.key)) {
    newInputState.keys[event.key] = true;
    newInputState.moveMode = 'keyboard';
  }
  
  return newInputState;
};

/**
 * Handle keyboard key up events
 * @param {KeyboardEvent} event - The keyboard event
 * @param {Object} inputState - The current input state
 * @returns {Object} Updated input state
 */
const handleKeyUp = (event, inputState) => {
  const newInputState = { ...inputState };
  
  if (newInputState.keys.hasOwnProperty(event.key)) {
    newInputState.keys[event.key] = false;
  }
  
  return newInputState;
};

/**
 * Handle mouse movement events
 * @param {MouseEvent} event - The mouse event
 * @param {Object} inputState - The current input state
 * @param {HTMLCanvasElement} canvas - The game canvas
 * @returns {Object} Updated input state
 */
const handleMouseMove = (event, inputState, canvas) => {
  const newInputState = { ...inputState };
  const rect = canvas.getBoundingClientRect();
  
  newInputState.mouse.x = event.clientX - rect.left;
  newInputState.mouse.y = event.clientY - rect.top;
  
  // If mouse button is pressed, switch to mouse movement mode
  if (newInputState.mouse.isDown) {
    newInputState.moveMode = 'mouse';
    newInputState.mouse.target = { 
      x: newInputState.mouse.x, 
      y: newInputState.mouse.y 
    };
  }
  
  return newInputState;
};

/**
 * Handle mouse down events
 * @param {MouseEvent} event - The mouse event
 * @param {Object} inputState - The current input state
 * @param {HTMLCanvasElement} canvas - The game canvas
 * @returns {Object} Updated input state
 */
const handleMouseDown = (event, inputState, canvas) => {
  const newInputState = { ...inputState };
  const rect = canvas.getBoundingClientRect();
  
  newInputState.mouse.isDown = true;
  newInputState.moveMode = 'mouse';
  newInputState.mouse.x = event.clientX - rect.left;
  newInputState.mouse.y = event.clientY - rect.top;
  newInputState.mouse.target = { 
    x: newInputState.mouse.x, 
    y: newInputState.mouse.y 
  };
  
  return newInputState;
};

/**
 * Handle mouse up events
 * @param {MouseEvent} event - The mouse event
 * @param {Object} inputState - The current input state
 * @returns {Object} Updated input state
 */
const handleMouseUp = (event, inputState) => {
  const newInputState = { ...inputState };
  newInputState.mouse.isDown = false;
  return newInputState;
};

/**
 * Handle mouse click events
 * @param {MouseEvent} event - The mouse event
 * @param {Object} inputState - The current input state
 * @param {HTMLCanvasElement} canvas - The game canvas
 * @returns {Object} Updated input state
 */
const handleClick = (event, inputState, canvas) => {
  const newInputState = { ...inputState };
  const rect = canvas.getBoundingClientRect();
  
  newInputState.mouse.x = event.clientX - rect.left;
  newInputState.mouse.y = event.clientY - rect.top;
  newInputState.moveMode = 'mouse';
  newInputState.mouse.target = { 
    x: newInputState.mouse.x, 
    y: newInputState.mouse.y 
  };
  
  return newInputState;
};

/**
 * Process keyboard movement based on current input state
 * @param {Object} player - The player object to move
 * @param {Object} inputState - The current input state
 * @param {Object} canvasDimensions - Width and height of canvas
 * @returns {Object} Updated player object
 */
const handleKeyboardMovement = (player, inputState, canvasDimensions) => {
  const newPlayer = { ...player };
  const { keys } = inputState;
  const { width, height } = canvasDimensions;
  
  let dx = 0;
  let dy = 0;
  
  // Calculate movement direction based on keys
  if (keys.ArrowUp || keys.w) dy -= 1;
  if (keys.ArrowDown || keys.s) dy += 1;
  if (keys.ArrowLeft || keys.a) dx -= 1;
  if (keys.ArrowRight || keys.d) dx += 1;
  
  // Normalize diagonal movement
  if (dx !== 0 && dy !== 0) {
    const length = Math.sqrt(dx * dx + dy * dy);
    dx = dx / length;
    dy = dy / length;
  }
  
  // Apply movement
  newPlayer.x += dx * newPlayer.speed;
  newPlayer.y += dy * newPlayer.speed;
  
  // Keep player within bounds
  newPlayer.x = Math.max(newPlayer.size, Math.min(width - newPlayer.size, newPlayer.x));
  newPlayer.y = Math.max(newPlayer.size, Math.min(height - newPlayer.size, newPlayer.y));
  
  return newPlayer;
};

/**
 * Process mouse movement based on current input state
 * @param {Object} player - The player object to move
 * @param {Object} inputState - The current input state
 * @param {Object} canvasDimensions - Width and height of canvas
 * @returns {Object} Updated player object
 */
const handleMouseMovement = (player, inputState, canvasDimensions) => {
  const newPlayer = { ...player };
  const { mouse } = inputState;
  const { width, height } = canvasDimensions;
  
  // Only move if we have a target
  if (mouse.target) {
    const dx = mouse.target.x - newPlayer.x;
    const dy = mouse.target.y - newPlayer.y;
    const distanceSquared = dx * dx + dy * dy;
    
    // If we're close enough to the target, stop moving
    if (distanceSquared < 25) {
      return newPlayer;
    }
    
    // Calculate normalized direction
    const distance = Math.sqrt(distanceSquared);
    const ndx = dx / distance;
    const ndy = dy / distance;
    
    // Apply movement
    newPlayer.x += ndx * newPlayer.speed;
    newPlayer.y += ndy * newPlayer.speed;
    
    // Keep player within bounds
    newPlayer.x = Math.max(newPlayer.size, Math.min(width - newPlayer.size, newPlayer.x));
    newPlayer.y = Math.max(newPlayer.size, Math.min(height - newPlayer.size, newPlayer.y));
  }
  
  return newPlayer;
};

// Export all event handlers
export {
  handleKeyDown,
  handleKeyUp,
  handleMouseMove,
  handleMouseDown,
  handleMouseUp,
  handleClick,
  handleKeyboardMovement,
  handleMouseMovement
}; 