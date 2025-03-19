// Game initialization function
const initGame = () => {
    const canvas = document.getElementById('game-canvas') || document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    // Set canvas size
    canvas.width = 800;
    canvas.height = 600;
    
    // If canvas doesn't exist in the DOM yet, add it
    if (!document.getElementById('game-canvas')) {
        document.body.appendChild(canvas);
    }
    
    // FPS tracking variables
    const fpsData = {
        frameCount: 0,
        lastTime: performance.now(),
        fps: 0,
        frames: [], // For rolling average
        updateInterval: 500 // Update FPS display every 500ms
    };
    
    // Generate a unique ID for this client
    const clientId = generateClientId();
    console.log(`Client ID: ${clientId}`);
    
    // Networking configuration
    const networkConfig = {
        syncInterval: 100, // Sync with server every 100ms
        lastSyncTime: 0
    };
    
    // Game state
    const gameState = {
        time: 0,
        clientId: clientId,
        entities: [],
        otherPlayers: {} // Will store states from other players
    };
    
    // Set up socket connection
    const socket = io();
    
    // Handle connection events
    socket.on('connect', () => {
        console.log('Connected to server');
        
        // Register with the server
        socket.emit('register', { 
            clientId: clientId 
        });
    });
    
    // Handle game state updates from server
    socket.on('gameState', (data) => {
        // Clear other players
        gameState.otherPlayers = {};
        
        // Process each player's state
        data.players.forEach(player => {
            // Don't include our own state
            if (player.clientId !== gameState.clientId) {
                gameState.otherPlayers[player.clientId] = player;
            }
        });
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    
    // Update FPS calculation
    const updateFPS = currentTime => {
        // Calculate time elapsed since last frame
        const elapsed = currentTime - fpsData.lastTime;
        
        // Increment frame counter
        fpsData.frameCount++;
        
        // If enough time has passed, update FPS
        if (elapsed >= fpsData.updateInterval) {
            // Calculate fps: frames / seconds
            const currentFps = Math.round(fpsData.frameCount / (elapsed / 1000));
            
            // Add to rolling array (keep last 5 values)
            fpsData.frames.push(currentFps);
            if (fpsData.frames.length > 5) {
                fpsData.frames.shift();
            }
            
            // Calculate average FPS
            fpsData.fps = Math.round(
                fpsData.frames.reduce((sum, fps) => sum + fps, 0) / fpsData.frames.length
            );
            
            // Reset frame counter and update last time
            fpsData.frameCount = 0;
            fpsData.lastTime = currentTime;
        }
        
        return fpsData.fps;
    };
    
    // Sync game state with server
    const syncGameState = time => {
        // Only sync at specified intervals
        if (time - networkConfig.lastSyncTime < networkConfig.syncInterval) {
            return;
        }
        
        networkConfig.lastSyncTime = time;
        
        // Create a state object to send to server
        const stateToSend = {
            clientId: gameState.clientId,
            timestamp: time,
            entities: gameState.entities
        };
        
        // Send our state to the server using WebSocket
        socket.emit('updateState', stateToSend);
    };
    
    // Draw FPS counter
    const drawFPS = (ctx, fps) => {
        const { width } = ctx.canvas;
        
        // Save context state
        ctx.save();
        
        // Style for FPS display
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(width - 80, 10, 70, 30);
        
        ctx.font = '18px Arial';
        ctx.fillStyle = fps > 45 ? '#8ff' : fps > 30 ? '#ff8' : '#f88';
        ctx.textAlign = 'right';
        ctx.fillText(`${fps} FPS`, width - 20, 30);
        
        // Restore context state
        ctx.restore();
    };
    
    // Game loop - uses pure functions for updates and rendering
    const gameLoop = currentTime => {
        // Calculate FPS
        const fps = updateFPS(currentTime);
        
        // Update game state
        updateGame(gameState, currentTime);
        
        // Sync with server
        syncGameState(currentTime);
        
        // Render game
        renderGame(ctx, gameState);
        
        // Draw FPS counter after everything else
        drawFPS(ctx, fps);
        
        // Continue the loop
        requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
};

// Generate a unique client ID
const generateClientId = () => {
    return 'client_' + Math.random().toString(36).substr(2, 9);
};

// Pure function to update game state
const updateGame = (state, time) => {
    // Update game time
    state.time = time;
    
    // Add game entities randomly
    if (Math.random() < 0.02) {
        state.entities.push({
            id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            owner: state.clientId,
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: Math.random() * 30 + 10,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            speedX: (Math.random() - 0.5) * 5,
            speedY: (Math.random() - 0.5) * 5
        });
    }
    
    // Limit entities to 30 for performance
    if (state.entities.length > 30) {
        state.entities.shift();
    }
    
    // Update entities
    state.entities.forEach(entity => {
        entity.x += entity.speedX;
        entity.y += entity.speedY;
        
        // Bounce off boundaries
        if (entity.x <= 0 || entity.x >= 800) entity.speedX *= -1;
        if (entity.y <= 0 || entity.y >= 600) entity.speedY *= -1;
    });
};

// Pure function to render the game
const renderGame = (ctx, state) => {
    const { width, height } = ctx.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw entities from this client
    state.entities.forEach(entity => {
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw entities from other players
    Object.values(state.otherPlayers).forEach(player => {
        if (player.entities) {
            player.entities.forEach(entity => {
                // Draw with a stroke to distinguish other players' entities
                ctx.fillStyle = entity.color || '#888';
                ctx.strokeStyle = '#fff';
                ctx.lineWidth = 2;
                
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.stroke();
            });
        }
    });
    
    // Draw player count
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Entities: ${state.entities.length}`, 10, 30);
    
    // Show connected players count
    const playerCount = Object.keys(state.otherPlayers).length + 1; // +1 for this client
    ctx.fillText(`Players: ${playerCount}`, 10, 60);
};

// Start the game when the page is loaded
window.addEventListener('load', initGame); 