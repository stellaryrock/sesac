const express = require('express');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');
const apiRoutes = require('./server/routes/api');
const logger = require('./server/middleware/logger');

// Configuration
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

// Create Express app
const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Game state storage
const gameState = {
  players: {},
  lastCleanup: Date.now()
};

// Apply middleware
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Serve static files from the public directory
app.use(express.static(PUBLIC_DIR));

// SPA fallback - serve index.html for any route not found
app.get('/', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// WebSocket handling for game state sync
io.on('connection', (socket) => {
  console.log('Player connected:', socket.id);
  
  // Handle player joining
  socket.on('playerJoin', (playerData) => {
    console.log('Player joined:', playerData.username);
    
    // Store player data
    gameState.players[socket.id] = {
      id: socket.id,
      username: playerData.username,
      position: playerData.position,
      color: playerData.color
    };
    
    // Inform other players about new player
    socket.broadcast.emit('newPlayer', gameState.players[socket.id]);
    
    // Send existing players to new player
    socket.emit('existingPlayers', gameState.players);
  });
  
  // Handle player updates
  socket.on('playerUpdate', (data) => {
    // Update player data
    if (gameState.players[socket.id]) {
      gameState.players[socket.id].position = data.position;
      if (data.rotation !== undefined) {
        gameState.players[socket.id].rotation = data.rotation;
      }
      if (data.animation !== undefined) {
        gameState.players[socket.id].animation = data.animation;
      }
    }
    
    // Broadcast to other players
    socket.broadcast.emit('playerUpdate', data);
  });
  
  // Handle disconnection
  socket.on('disconnect', () => {
    console.log('Player disconnected:', socket.id);
    
    // Remove player from list
    delete gameState.players[socket.id];
    
    // Inform others
    io.emit('playerLeft', socket.id);
  });
});

// Periodic cleanup of inactive players
setInterval(() => {
  const now = Date.now();
  Object.keys(gameState.players).forEach(clientId => {
    if (now - gameState.players[clientId].lastSeen > 30000) { // 30 second timeout
      console.log(`Client ${clientId} timed out. Removing from game state.`);
      delete gameState.players[clientId];
    }
  });
  gameState.lastCleanup = now;
}, 10000); // Cleanup every 10 seconds

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'production' ? null : err.message
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`
  ┌───────────────────────────────────────────────┐
  │                                               │
  │   Pokpi Game Server running with WebSockets!  │
  │                                               │
  │   🌐 http://localhost:${PORT}                  │
  │   📂 Serving from: ${PUBLIC_DIR}              │
  │   🔌 API: http://localhost:${PORT}/api         │
  │   🎮 WebSockets enabled                        │
  │                                               │
  │   Press Ctrl+C to stop                        │
  │                                               │
  └───────────────────────────────────────────────┘
  `);
});

// Handle server shutdown
process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped.');
    process.exit(0);
  });
}); 