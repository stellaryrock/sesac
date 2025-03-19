/**
 * Smoothly interpolates between positions of other players
 * to create fluid movement even with network latency
 */

/**
 * Initialize an interpolation state for a player
 * @param {Object} player - The player data from server
 * @returns {Object} Interpolation state for this player
 */
const initializeInterpolation = (player) => {
  return {
    previousPosition: { x: player.player.x, y: player.player.y },
    currentPosition: { x: player.player.x, y: player.player.y },
    targetPosition: { x: player.player.x, y: player.player.y },
    lastUpdateTime: performance.now(),
    updateInterval: 50, // Assume 50ms update rate initially
    smoothingFactor: 0.1 // 0-1, higher = more responsive but less smooth
  };
};

/**
 * Update the interpolation state when new player data is received
 * @param {Object} interpolationState - Current interpolation state
 * @param {Object} newPlayerData - New player data from server
 * @returns {Object} Updated interpolation state
 */
const updateInterpolation = (interpolationState, newPlayerData) => {
  const now = performance.now();
  const timeSinceLastUpdate = now - interpolationState.lastUpdateTime;
  
  // Store current position as previous position
  const newState = {
    ...interpolationState,
    previousPosition: { 
      x: interpolationState.currentPosition.x, 
      y: interpolationState.currentPosition.y 
    },
    targetPosition: { 
      x: newPlayerData.player.x, 
      y: newPlayerData.player.y 
    },
    lastUpdateTime: now
  };
  
  // If we have a valid time interval, update the interval estimation
  if (timeSinceLastUpdate > 10 && timeSinceLastUpdate < 1000) {
    // Use weighted average to smooth out update intervals
    newState.updateInterval = interpolationState.updateInterval * 0.8 + timeSinceLastUpdate * 0.2;
  }
  
  return newState;
};

/**
 * Calculate the interpolated position for rendering
 * @param {Object} interpolationState - Current interpolation state
 * @returns {Object} Interpolated position {x, y}
 */
const getInterpolatedPosition = (interpolationState) => {
  const now = performance.now();
  const timeSinceLastUpdate = now - interpolationState.lastUpdateTime;
  
  // Calculate progress based on time (0 to 1)
  // Cap at 1.2 to allow slight overshooting for more responsive updates
  const progress = Math.min(1.2, timeSinceLastUpdate / interpolationState.updateInterval);
  
  // Apply easing function (cubic easing out)
  const easedProgress = easeOutCubic(progress);
  
  // Interpolate between previous and target position
  return {
    x: interpolationState.previousPosition.x + 
       (interpolationState.targetPosition.x - interpolationState.previousPosition.x) * easedProgress,
    y: interpolationState.previousPosition.y + 
       (interpolationState.targetPosition.y - interpolationState.previousPosition.y) * easedProgress
  };
};

/**
 * Cubic easing out function for smooth movement
 * @param {number} t - Progress (0-1)
 * @returns {number} Eased value
 */
const easeOutCubic = (t) => {
  return 1 - Math.pow(1 - Math.min(1, t), 3);
};

/**
 * Apply interpolation to current position directly
 * @param {Object} interpolationState - Current interpolation state
 * @returns {Object} Updated interpolation state with new current position
 */
const applyInterpolation = (interpolationState) => {
  const interpolatedPosition = getInterpolatedPosition(interpolationState);
  
  return {
    ...interpolationState,
    currentPosition: interpolatedPosition
  };
};

// Export interpolation functions
export {
  initializeInterpolation,
  updateInterpolation,
  getInterpolatedPosition,
  applyInterpolation
}; 