// Import event handlers
import {
  handleKeyDown,
  handleKeyUp,
  handleMouseMove,
  handleMouseDown,
  handleMouseUp,
  handleClick,
  handleKeyboardMovement,
  handleMouseMovement
} from './eventHandlers.js';

// Import interpolation
import {
  initializeInterpolation,
  updateInterpolation,
  applyInterpolation
} from './interpolation.js';

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
    
    // Define sprite sheet configuration
    const spriteConfig = {
        frameWidth: 64,    // Width of each frame in pixels
        frameHeight: 64,   // Height of each frame in pixels
        animations: {
            idle: {
                row: 0,
                frames: 4,     // Number of frames in idle animation
                frameRate: 5   // Frames per second
            },
            throwing: {
                row: 1,
                frames: 4,     // Number of frames in throwing animation
                frameRate: 8
            },
            running: {
                row: 2,
                frames: 8,     // Number of frames in running animation
                frameRate: 12
            }
        }
    };
    
    // Load character sprites
    const characterSprites = {
        default: loadImage('/assets/character'),
        // Color variants (can be null if using tinting)
        variants: [null, null, null, null]
    };
    
    // Load tileset sprite
    const tilesetImage = loadImage('/assets/tileset');
    
    // Define tilemap
    const tilemap = {
        tileSize: 32,
        width: 50,   // Map width in tiles
        height: 20,  // Map height in tiles
        layers: [
            // Background layer
            [
                // Define a simple platformer level
                // 0 = empty, 1 = ground, 2 = platform, 3 = block
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,2,2,2,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,3,3,3,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
                [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
            ]
        ],
        // Tile types and their properties
        tileTypes: {
            0: { solid: false, name: 'empty' },     // Empty space
            1: { solid: true, name: 'ground' },     // Ground tile
            2: { solid: true, name: 'platform' },   // Platform tile
            3: { solid: true, name: 'block' }       // Block tile
        },
        // Tileset mapping (which part of tileset image to use for each tile type)
        tilesetMap: {
            0: { x: 0, y: 0 },    // Empty (not drawn)
            1: { x: 0, y: 0 },    // Ground tile at position 0,0 in tileset
            2: { x: 1, y: 0 },    // Platform tile at position 1,0 in tileset
            3: { x: 2, y: 0 }     // Block tile at position 2,0 in tileset
        }
    };
    
    // FPS tracking variables
    const fpsData = {
        frameCount: 0,
        lastTime: performance.now(),
        fps: 0,
        frames: [], // For rolling average
        updateInterval: 500 // Update FPS display every 500ms
    };
    
    // Input state - using let instead of const so it can be reassigned
    let inputState = {
        keys: {
            ArrowUp: false,
            ArrowDown: false,
            ArrowLeft: false,
            ArrowRight: false,
            w: false,
            a: false,
            s: false,
            d: false,
            ' ': false  // Space key for jumping
        },
        mouse: {
            x: canvas.width / 2,
            y: canvas.height / 2,
            isDown: false,
            target: null // Target position for movement
        },
        moveMode: 'keyboard' // 'keyboard' or 'mouse'
    };
    
    // Generate a unique ID for this client
    const clientId = generateClientId();
    console.log(`Client ID: ${clientId}`);
    
    // Networking configuration
    const networkConfig = {
        syncInterval: 50, // Sync with server every 50ms
        lastSyncTime: 0
    };
    
    // Camera/View configuration
    const camera = {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
        followPlayer: true
    };
    
    // Game state
    const gameState = {
        time: 0,
        clientId: clientId,
        player: {
            x: 200,
            y: 300,
            width: 40,      // Collision width
            height: 60,     // Collision height
            speed: 5,
            jumpPower: 15,
            velocityX: 0,
            velocityY: 0,
            onGround: false,
            size: 30,       // Visual size (radius)
            color: `hsl(${Math.floor(Math.random() * 360)}, 100%, 50%)`,
            name: `Player ${clientId.slice(-4)}`,
            spriteIndex: Math.floor(Math.random() * 4), // Random sprite variant
            animation: {
                current: 'idle', // Current animation name
                frame: 0,        // Current frame within animation
                lastUpdate: 0,   // Last time the frame was updated
                throwingComplete: true // Flag to track if throwing animation is complete
            },
            direction: 1     // 1 for right, -1 for left
        },
        entities: [],
        otherPlayers: {}, // Will store states from other players
        interpolation: {}, // Will store interpolation state for each player
        assets: {
            characters: characterSprites,
            tileset: tilesetImage
        },
        spriteConfig: spriteConfig,
        tilemap: tilemap,
        camera: camera,
        gravity: 0.6,     // Gravity strength
        friction: 0.8,    // Horizontal friction (air and ground)
        airControl: 0.5   // Reduced control while in air
    };
    
    // Set up socket connection
    const socket = io();
    
    // Handle connection events
    socket.on('connect', () => {
        console.log('Connected to server');
        
        // Register with the server
        socket.emit('register', { 
            clientId: clientId,
            player: gameState.player
        });
    });
    
    // Handle game state updates from server
    socket.on('gameState', (data) => {
        // Process each player's state
        if (data.players && Array.isArray(data.players)) {
            // Store a temp copy of current players to handle removed players
            const previousPlayers = {...gameState.otherPlayers};
            
            // Clear other players to repopulate
            gameState.otherPlayers = {};
            
            data.players.forEach(player => {
                // Don't include our own state
                if (player.clientId !== gameState.clientId && player.player) {
                    // Add player to our state
                    gameState.otherPlayers[player.clientId] = player;
                    
                    // Set up or update interpolation for this player
                    if (!gameState.interpolation[player.clientId]) {
                        // Initialize interpolation for new player
                        gameState.interpolation[player.clientId] = initializeInterpolation(player);
                    } else {
                        // Update interpolation with new position data
                        gameState.interpolation[player.clientId] = updateInterpolation(
                            gameState.interpolation[player.clientId], 
                            player
                        );
                    }
                }
            });
            
            // Clean up interpolation for players who left
            Object.keys(gameState.interpolation).forEach(playerId => {
                if (!gameState.otherPlayers[playerId]) {
                    delete gameState.interpolation[playerId];
                }
            });
        } else {
            console.error("Invalid gameState data format:", data);
        }
    });
    
    // Handle disconnection
    socket.on('disconnect', () => {
        console.log('Disconnected from server');
    });
    
    // Register event listeners with wrapper functions that update the input state
    window.addEventListener('keydown', event => {
        inputState = handleKeyDown(event, inputState);
        
        // Start throwing animation on space key
        if (event.code === 'Space' && gameState.player.animation.throwingComplete) {
            gameState.player.animation.current = 'throwing';
            gameState.player.animation.frame = 0;
            gameState.player.animation.throwingComplete = false;
        }
    });
    
    window.addEventListener('keyup', event => {
        inputState = handleKeyUp(event, inputState);
    });
    
    canvas.addEventListener('mousemove', event => {
        inputState = handleMouseMove(event, inputState, canvas);
    });
    
    canvas.addEventListener('mousedown', event => {
        inputState = handleMouseDown(event, inputState, canvas);
        
        // Start throwing animation on mouse down
        if (gameState.player.animation.throwingComplete) {
            gameState.player.animation.current = 'throwing';
            gameState.player.animation.frame = 0;
            gameState.player.animation.throwingComplete = false;
        }
    });
    
    canvas.addEventListener('mouseup', event => {
        inputState = handleMouseUp(event, inputState);
    });
    
    canvas.addEventListener('click', event => {
        inputState = handleClick(event, inputState, canvas);
    });
    
    // Update FPS and return current value
    const updateFPS = currentTime => {
        fpsData.frameCount++;
        const elapsed = currentTime - fpsData.lastTime;
        
        // Store frame time for rolling average
        fpsData.frames.push(elapsed);
        if (fpsData.frames.length > 60) {
            fpsData.frames.shift();
        }
        
        // Update FPS calculation periodically
        if (elapsed >= fpsData.updateInterval) {
            // Calculate rolling average FPS
            const totalFrameTime = fpsData.frames.reduce((sum, time) => sum + time, 0);
            const averageFrameTime = totalFrameTime / fpsData.frames.length || 1;
            fpsData.fps = 1000 / averageFrameTime;
            
            fpsData.frameCount = 0;
            fpsData.lastTime = currentTime;
        }
        
        return fpsData.fps;
    };
    
    // Draw FPS counter
    const drawFPS = (ctx, fps) => {
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`FPS: ${Math.round(fps)}`, ctx.canvas.width - 10, 20);
    };
    
    // Game loop
    const gameLoop = currentTime => {
        // Calculate FPS
        const fps = updateFPS(currentTime);
        
        // Update player animation state
        updatePlayerAnimation(gameState.player, currentTime, spriteConfig);
        
        // Update player based on input
        updatePlayer(gameState.player, inputState, gameState);
        
        // Update game state
        updateGame(gameState, currentTime);
        
        // Update camera position to follow player
        if (gameState.camera.followPlayer) {
            updateCamera(gameState.camera, gameState.player, canvas, gameState.tilemap);
        }
        
        // Update interpolation for other players
        Object.keys(gameState.interpolation).forEach(playerId => {
            gameState.interpolation[playerId] = applyInterpolation(gameState.interpolation[playerId]);
        });
        
        // Sync with server periodically
        if (currentTime - networkConfig.lastSyncTime > networkConfig.syncInterval) {
            socket.emit('updateState', {
                clientId: gameState.clientId,
                player: gameState.player,
                entities: gameState.entities
            });
            networkConfig.lastSyncTime = currentTime;
        }
        
        // Render game
        renderGame(ctx, gameState);
        
        // Draw FPS counter after everything else
        drawFPS(ctx, fps);
        
        // Continue the loop
        requestAnimationFrame(gameLoop);
    };
    
    // Start the game loop
    requestAnimationFrame(gameLoop);
    
    // Cleanup event listeners when window is closed or navigated away
    window.addEventListener('beforeunload', () => {
        window.removeEventListener('keydown', handleKeyDown);
        window.removeEventListener('keyup', handleKeyUp);
        canvas.removeEventListener('mousemove', handleMouseMove);
        canvas.removeEventListener('mousedown', handleMouseDown);
        canvas.removeEventListener('mouseup', handleMouseUp);
        canvas.removeEventListener('click', handleClick);
    });
};

// Update player based on input and physics
const updatePlayer = (player, inputState, gameState) => {
    // Get input for movement
    const moveLeft = inputState.keys.ArrowLeft || inputState.keys.a;
    const moveRight = inputState.keys.ArrowRight || inputState.keys.d;
    const jump = inputState.keys.ArrowUp || inputState.keys.w || inputState.keys[' '];
    
    // Apply gravity
    player.velocityY += gameState.gravity;
    
    // Cap falling speed
    player.velocityY = Math.min(player.velocityY, 20);
    
    // Apply air control factor when not on ground
    const controlFactor = player.onGround ? 1 : gameState.airControl;
    
    // Horizontal movement
    if (moveLeft) {
        player.velocityX -= player.speed * controlFactor;
        player.direction = -1;
        if (player.onGround && player.animation.current !== 'throwing') {
            player.animation.current = 'running';
        }
    } else if (moveRight) {
        player.velocityX += player.speed * controlFactor;
        player.direction = 1;
        if (player.onGround && player.animation.current !== 'throwing') {
            player.animation.current = 'running';
        }
    } else if (player.onGround && player.animation.current !== 'throwing') {
        player.animation.current = 'idle';
    }
    
    // Jumping
    if (jump && player.onGround) {
        player.velocityY = -player.jumpPower;
        player.onGround = false;
    }
    
    // Apply friction
    player.velocityX *= gameState.friction;
    
    // Apply movement with tile collision
    moveWithCollision(player, gameState.tilemap);
    
    // Reset onGround for next collision check
    player.onGround = false;
    
    // Check for ground collision
    checkGroundCollision(player, gameState.tilemap);
    
    // Update animation based on state
    if (!player.onGround && player.animation.current !== 'throwing') {
        player.animation.current = 'idle'; // Use idle animation for jumping/falling
    }
};

// Update camera position to follow player
const updateCamera = (camera, player, canvas, tilemap) => {
    // Calculate target camera position (center on player)
    const targetX = player.x - (camera.width / 2);
    const targetY = player.y - (camera.height / 2);
    
    // Apply camera bounds to keep within map
    camera.x = Math.max(0, Math.min(targetX, tilemap.width * tilemap.tileSize - camera.width));
    camera.y = Math.max(0, Math.min(targetY, tilemap.height * tilemap.tileSize - camera.height));
};

// Check if a player is on the ground by doing a collision check slightly below them
const checkGroundCollision = (player, tilemap) => {
    // Create a small sensor below the player
    const sensor = {
        x: player.x,
        y: player.y + player.height / 2 + 1, // 1 pixel below player's feet
        width: player.width * 0.8,
        height: 2
    };
    
    // Check if this sensor collides with any solid tiles
    const collides = checkTileCollision(sensor, tilemap);
    
    if (collides) {
        player.onGround = true;
    }
};

// Move a player with collision detection against the tilemap
const moveWithCollision = (player, tilemap) => {
    // Apply horizontal movement
    if (Math.abs(player.velocityX) > 0.1) {
        player.x += player.velocityX;
        
        // Check horizontal collision
        const horizontalCollision = checkTileCollision(player, tilemap);
        if (horizontalCollision) {
            // Resolve horizontal collision
            if (player.velocityX > 0) {
                // Moving right, align to left edge of tile
                player.x = horizontalCollision.x - player.width / 2;
            } else {
                // Moving left, align to right edge of tile
                player.x = horizontalCollision.x + tilemap.tileSize + player.width / 2;
            }
            player.velocityX = 0;
        }
    }
    
    // Apply vertical movement
    player.y += player.velocityY;
    
    // Check vertical collision
    const verticalCollision = checkTileCollision(player, tilemap);
    if (verticalCollision) {
        // Resolve vertical collision
        if (player.velocityY > 0) {
            // Falling down, align to top edge of tile
            player.y = verticalCollision.y - player.height / 2;
            player.onGround = true;
        } else {
            // Moving up, align to bottom edge of tile
            player.y = verticalCollision.y + tilemap.tileSize + player.height / 2;
        }
        player.velocityY = 0;
    }
};

// Check collision between a player and the tilemap
const checkTileCollision = (player, tilemap) => {
    // Calculate the tile range to check (only nearby tiles)
    const startTileX = Math.max(0, Math.floor((player.x - player.width/2) / tilemap.tileSize) - 1);
    const endTileX = Math.min(tilemap.width - 1, Math.floor((player.x + player.width/2) / tilemap.tileSize) + 1);
    const startTileY = Math.max(0, Math.floor((player.y - player.height/2) / tilemap.tileSize) - 1);
    const endTileY = Math.min(tilemap.height - 1, Math.floor((player.y + player.height/2) / tilemap.tileSize) + 1);
    
    // Check each tile in the range
    for (let y = startTileY; y <= endTileY; y++) {
        for (let x = startTileX; x <= endTileX; x++) {
            const tileType = tilemap.layers[0][y][x];
            
            // Skip non-solid tiles
            if (!tilemap.tileTypes[tileType].solid) continue;
            
            // Calculate tile position
            const tileX = x * tilemap.tileSize;
            const tileY = y * tilemap.tileSize;
            
            // Check for collision with this tile
            if (player.x + player.width/2 > tileX && 
                player.x - player.width/2 < tileX + tilemap.tileSize &&
                player.y + player.height/2 > tileY && 
                player.y - player.height/2 < tileY + tilemap.tileSize) {
                // Return the tile position for collision resolution
                return { x: tileX, y: tileY };
            }
        }
    }
    
    return null; // No collision
};

// Update player animation state
const updatePlayerAnimation = (player, currentTime, spriteConfig) => {
    if (!player.animation) return;
    
    const animation = spriteConfig.animations[player.animation.current];
    if (!animation) return;
    
    // Calculate time since last frame update
    const elapsed = currentTime - player.animation.lastUpdate;
    const frameDuration = 1000 / animation.frameRate;
    
    // Update frame if enough time has passed
    if (elapsed >= frameDuration) {
        player.animation.frame = (player.animation.frame + 1) % animation.frames;
        player.animation.lastUpdate = currentTime;
        
        // If throwing animation is complete, switch back to idle
        if (player.animation.current === 'throwing' && player.animation.frame === animation.frames - 1) {
            player.animation.throwingComplete = true;
            player.animation.current = 'idle';
            player.animation.frame = 0;
        }
    }
};

// Load an image and return the Image object
const loadImage = (src) => {
    const img = new Image();
    img.src = src;
    
    // Add error handling
    img.onerror = () => {
        console.error(`Failed to load image: ${src}`);
        // Try with extensions if no extension was provided
        if (!src.includes('.')) {
            console.log('Trying with extensions...');
            img.src = src + '.png'; // Try PNG
            
            img.onerror = () => {
                img.src = src + '.webp'; // Try WebP if PNG fails
                
                img.onerror = () => {
                    console.error('Could not load image with any extension');
                };
            };
        }
    };
    
    return img;
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
    if (Math.random() < 0.005) {
        state.entities.push({
            id: `entity_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
            owner: state.clientId,
            x: Math.random() * 800,
            y: Math.random() * 600,
            size: Math.random() * 10 + 5,
            color: `hsl(${Math.random() * 360}, 80%, 60%)`,
            speedX: (Math.random() - 0.5) * 3,
            speedY: (Math.random() - 0.5) * 3
        });
    }
    
    // Limit entities to 20 for performance
    if (state.entities.length > 20) {
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

// Draw a player character using sprite with animation
const drawPlayer = (ctx, player, isCurrentPlayer, assets, spriteConfig, camera) => {
    if (!player) return; // Safety check
    
    // Save context state
    ctx.save();
    
    const sprite = assets.characters.default;
    
    // Calculate screen position (apply camera offset)
    const screenX = player.x - camera.x;
    const screenY = player.y - camera.y;
    
    // Draw player sprite if available
    if (sprite && sprite.complete) {
        const size = player.size * 2; // Double size for better visibility
        
        // Get animation details
        const animation = player.animation || { current: 'idle', frame: 0 };
        const animConfig = spriteConfig.animations[animation.current] || spriteConfig.animations.idle;
        
        // Calculate source rectangle from sprite sheet
        const sx = animation.frame * spriteConfig.frameWidth;
        const sy = animConfig.row * spriteConfig.frameHeight;
        const sw = spriteConfig.frameWidth;
        const sh = spriteConfig.frameHeight;
        
        // Calculate destination rectangle on screen
        const dx = screenX - size/2;
        const dy = screenY - size/2;
        const dw = size;
        const dh = size;
        
        // Apply color tinting based on spriteIndex
        if (player.spriteIndex !== undefined) {
            const colors = [
                '#3498db', // Blue
                '#e74c3c', // Red
                '#2ecc71', // Green
                '#f1c40f'  // Yellow
            ];
            
            ctx.fillStyle = colors[player.spriteIndex] || player.color;
            ctx.globalAlpha = 0.3; // Subtle tint
            ctx.fillRect(dx, dy, dw, dh);
            ctx.globalAlpha = 1.0;
        }
        
        // Draw the character sprite with appropriate direction
        ctx.save();
        if (player.direction === -1) {
            // Flip horizontally for left direction
            ctx.translate(screenX * 2, 0);
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(
            sprite,
            sx, sy, sw, sh,         // Source rectangle (from sprite sheet)
            player.direction === -1 ? screenX - size/2 : dx, dy, dw, dh // Destination rectangle
        );
        ctx.restore();
    } 
    // Fallback to rectangle if image not loaded
    else {
        ctx.fillStyle = player.color || 'gray';
        ctx.fillRect(screenX - player.width/2, screenY - player.height/2, player.width, player.height);
    }
    
    // Add outline for current player
    if (isCurrentPlayer) {
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 2;
        ctx.strokeRect(screenX - player.width/2 - 2, screenY - player.height/2 - 2, player.width + 4, player.height + 4);
    }
    
    // Draw player name
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    ctx.fillText(player.name || 'Unknown', screenX, screenY - player.height/2 - 5);
    
    // Debug: draw collision box
    if (isCurrentPlayer) {
        ctx.strokeStyle = 'rgba(255,255,0,0.3)';
        ctx.lineWidth = 1;
        ctx.strokeRect(screenX - player.width/2, screenY - player.height/2, player.width, player.height);
        
        // Draw ground sensor
        if (player.onGround) {
            ctx.fillStyle = 'rgba(0,255,0,0.5)';
        } else {
            ctx.fillStyle = 'rgba(255,0,0,0.5)';
        }
        ctx.fillRect(screenX - player.width*0.4, screenY + player.height/2, player.width*0.8, 2);
    }
    
    // Restore context state
    ctx.restore();
};

// Draw the tilemap based on camera position
const drawTilemap = (ctx, tilemap, assets, camera) => {
    const tileSize = tilemap.tileSize;
    
    // Calculate the visible tile range based on camera position
    const startCol = Math.floor(camera.x / tileSize);
    const endCol = Math.min(tilemap.width - 1, Math.floor((camera.x + camera.width) / tileSize));
    const startRow = Math.floor(camera.y / tileSize);
    const endRow = Math.min(tilemap.height - 1, Math.floor((camera.y + camera.height) / tileSize));
    
    // Draw visible tiles
    for (let row = startRow; row <= endRow; row++) {
        for (let col = startCol; col <= endCol; col++) {
            const tileType = tilemap.layers[0][row][col];
            
            // Skip empty tiles
            if (tileType === 0) continue;
            
            // Get tile position in tileset
            const tilesetInfo = tilemap.tilesetMap[tileType];
            
            // Draw tile
            if (assets.tileset && assets.tileset.complete) {
                // Use tileset image if available
                const sx = tilesetInfo.x * tileSize;
                const sy = tilesetInfo.y * tileSize;
                const sw = tileSize;
                const sh = tileSize;
                const dx = col * tileSize - camera.x;
                const dy = row * tileSize - camera.y;
                const dw = tileSize;
                const dh = tileSize;
                
                ctx.drawImage(assets.tileset, sx, sy, sw, sh, dx, dy, dw, dh);
            } else {
                // Draw colored rectangles as fallback
                const colors = {
                    1: '#8B4513', // Brown for ground
                    2: '#4682B4', // Steel blue for platforms
                    3: '#708090'  // Slate gray for blocks
                };
                
                const color = colors[tileType] || '#999';
                ctx.fillStyle = color;
                
                const tileX = col * tileSize - camera.x;
                const tileY = row * tileSize - camera.y;
                ctx.fillRect(tileX, tileY, tileSize, tileSize);
                
                // Add a border
                ctx.strokeStyle = 'rgba(0,0,0,0.3)';
                ctx.strokeRect(tileX, tileY, tileSize, tileSize);
            }
        }
    }
};

// Pure function to render the game
const renderGame = (ctx, state) => {
    const { width, height } = ctx.canvas;
    
    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    
    // Draw background
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, width, height);
    
    // Draw grid for visual reference
    drawGrid(ctx, width, height);
    
    // Draw floating entities from this client
    state.entities.forEach(entity => {
        ctx.fillStyle = entity.color;
        ctx.beginPath();
        ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
        ctx.fill();
    });
    
    // Draw entities from other players
    Object.values(state.otherPlayers).forEach(player => {
        if (player.entities && Array.isArray(player.entities)) {
            player.entities.forEach(entity => {
                ctx.fillStyle = entity.color || '#888';
                ctx.beginPath();
                ctx.arc(entity.x, entity.y, entity.size, 0, Math.PI * 2);
                ctx.fill();
            });
        }
    });
    
    // Draw all other players with interpolation
    Object.keys(state.otherPlayers).forEach(playerId => {
        const player = state.otherPlayers[playerId];
        if (player.player && state.interpolation[playerId]) {
            // Create a copy of player data with interpolated position
            const interpolatedPlayer = {
                ...player.player,
                x: state.interpolation[playerId].currentPosition.x,
                y: state.interpolation[playerId].currentPosition.y
            };
            
            // Draw using the interpolated position
            drawPlayer(ctx, interpolatedPlayer, false, state.assets, state.spriteConfig, state.camera);
        }
    });
    
    // Draw current player on top
    drawPlayer(ctx, state.player, true, state.assets, state.spriteConfig, state.camera);
    
    // Draw debug - show number of other players
    ctx.fillStyle = '#fff';
    ctx.font = '16px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Players: ${Object.keys(state.otherPlayers).length + 1}`, 10, 30);
    ctx.fillText(`Your ID: ${state.clientId.slice(-6)}`, 10, 55);
    ctx.fillText(`Animation: ${state.player.animation.current} (${state.player.animation.frame})`, 10, 80);
    
    // Draw controls info
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(10, height - 80, 280, 70);
    ctx.fillStyle = '#fff';
    ctx.fillText('Controls: WASD / Arrow keys', 20, height - 60);
    ctx.fillText('Space/Click to throw', 20, height - 40);
    ctx.fillText('Mouse movement: Click where to go', 20, height - 20);
};

// Draw a grid background
const drawGrid = (ctx, width, height) => {
    const gridSize = 40;
    
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.lineWidth = 1;
    
    // Draw vertical lines
    for (let x = gridSize; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
    }
    
    // Draw horizontal lines
    for (let y = gridSize; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
    }
};

// Start the game when the page is loaded
window.addEventListener('load', initGame); 