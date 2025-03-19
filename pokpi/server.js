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
app.get('*', (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, 'index.html'));
});

// WebSocket handling for game state sync
io.on('connection', (socket) => {
  console.log(`New client connected: ${socket.id}`);
  
  // Handle client registration
  socket.on('register', (clientData) => {
    const clientId = clientData.clientId;
    console.log(`Client registered: ${clientId}`);
    
    // Store this client in game state
    gameState.players[clientId] = {
      clientId: clientId,
      socketId: socket.id,
      lastSeen: Date.now(),
      player: clientData.player || {
        x: 400,
        y: 300,
        color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
        size: 20,
        name: `Player ${clientId.slice(-4)}`
      },
      entities: []
    };
    
    // Send initial game state to client
    io.emit('gameState', {
      players: Object.values(gameState.players)
    });
  });
  
  // Handle client state updates
  socket.on('updateState', (clientState) => {
    const clientId = clientState.clientId;
    
    if (gameState.players[clientId]) {
      // Update client's state
      gameState.players[clientId].player = clientState.player || gameState.players[clientId].player;
      gameState.players[clientId].entities = clientState.entities || [];
      gameState.players[clientId].lastSeen = Date.now();
    }
    
    // Broadcast game state to all clients
    io.emit('gameState', {
      players: Object.values(gameState.players)
    });
  });
  
  // Handle disconnects
  socket.on('disconnect', () => {
    console.log(`Client disconnected: ${socket.id}`);
    
    // Find and remove the disconnected client
    Object.keys(gameState.players).forEach(clientId => {
      if (gameState.players[clientId].socketId === socket.id) {
        console.log(`Removing client: ${clientId}`);
        delete gameState.players[clientId];
      }
    });
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