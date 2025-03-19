// Game controller - handles game-related operations

/**
 * Save a game state
 */
exports.saveGame = (req, res) => {
  try {
    const saveData = req.body;
    
    // Here you would save the data to a database or file
    // For now we'll just echo it back
    
    res.status(200).json({
      success: true,
      message: 'Game saved successfully',
      saveId: Date.now().toString(),
      data: saveData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error saving game',
      error: error.message
    });
  }
};

/**
 * Load a game state
 */
exports.loadGame = (req, res) => {
  try {
    const saveId = req.params.id;
    
    // Here you would load data from a database or file
    // For now we'll return a dummy response
    
    res.status(200).json({
      success: true,
      message: 'Game loaded successfully',
      saveId: saveId,
      data: {
        player: {
          position: { x: 100, y: 100 },
          health: 100,
          score: 0
        },
        level: 1,
        timestamp: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error loading game',
      error: error.message
    });
  }
};

/**
 * List all saved games
 */
exports.listSaves = (req, res) => {
  try {
    // Here you would get all saves from a database or file
    
    res.status(200).json({
      success: true,
      saves: [
        { id: '1', date: new Date().toISOString(), level: 1 },
        { id: '2', date: new Date().toISOString(), level: 2 }
      ]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error listing saves',
      error: error.message
    });
  }
};

/**
 * Delete a saved game
 */
exports.deleteGame = (req, res) => {
  try {
    const saveId = req.params.id;
    
    // Here you would delete from a database or file
    
    res.status(200).json({
      success: true,
      message: `Save ${saveId} deleted successfully`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting save',
      error: error.message
    });
  }
};

// Game state storage
const gameStates = {
  players: {},
  lastCleanup: Date.now()
};

/**
 * Sync game state with all clients
 */
exports.syncGameState = (req, res) => {
  try {
    const clientState = req.body;
    const clientId = clientState.clientId;
    
    // Store this client's state
    gameStates.players[clientId] = {
      clientId: clientId,
      timestamp: clientState.timestamp || Date.now(),
      lastSeen: Date.now(),
      entities: clientState.entities || []
    };
    
    // Clean up old clients (players who haven't sent updates in a while)
    const now = Date.now();
    
    // Only clean up periodically (every 10 seconds)
    if (now - gameStates.lastCleanup > 10000) {
      Object.keys(gameStates.players).forEach(id => {
        if (now - gameStates.players[id].lastSeen > 30000) { // 30 seconds timeout
          console.log(`Client ${id} timed out. Removing from game state.`);
          delete gameStates.players[id];
        }
      });
      gameStates.lastCleanup = now;
    }
    
    // Return all players' states to the client
    res.status(200).json({
      success: true,
      timestamp: now,
      players: Object.values(gameStates.players)
    });
  } catch (error) {
    console.error('Error in syncGameState:', error);
    res.status(500).json({
      success: false,
      message: 'Error syncing game state',
      error: error.message
    });
  }
}; 