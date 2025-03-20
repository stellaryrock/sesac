/**
 * Main game module
 * Imports all necessary components and initializes the game
 */
import * as THREE from 'three';

// Check if engine components are loaded
if (!window.Scene || !window.Sprite || !window.Utils) {
    console.error("Game engine components not found! Make sure they are loaded before this script.");
}

// First, make sure all engine components are loaded and globally available
// This is important because our scene classes depend on these
const Utils = window.Utils;
const InputManager = window.InputManager;
const PhysicsSystem = window.PhysicsSystem;
const Sprite = window.Sprite;
const Scene = window.Scene;
const GameEngine = window.GameEngine;

// Define scene classes
class MainMenuScene {
    constructor() {
        // Create a new Scene instance
        this.scene = new THREE.Scene();
        this.name = 'mainMenu';
        this.entities = [];
        this.engine = null;
        
        // Add title text
        this.title = this.createSprite({
            width: 400,
            height: 100,
            color: 0x3498db,
            position: { x: 0, y: -100 },
            name: 'title'
        });
        
        // Add start button
        this.startButton = this.createSprite({
            width: 200,
            height: 50,
            color: 0x2ecc71,
            position: { x: 0, y: 50 },
            name: 'startButton'
        });
    }
    
    createSprite(options) {
        const sprite = new Sprite(options);
        this.add(sprite);
        return sprite;
    }
    
    setEngine(engine) {
        this.engine = engine;
    }
    
    add(entity) {
        this.entities.push(entity);
        this.scene.add(entity.mesh);
        
        // Add to physics system if enabled
        if (this.engine && entity.physics && entity.physics.enabled) {
            this.engine.physics.addEntity(entity);
        }
        
        return entity;
    }
    
    remove(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            this.scene.remove(entity.mesh);
            
            // Remove from physics system
            if (this.engine && entity.physics && entity.physics.enabled) {
                this.engine.physics.removeEntity(entity);
            }
        }
    }
    
    onEnter() {
        console.log('Entered main menu scene');
    }
    
    onExit() {
        // Called when scene is no longer active
    }
    
    update(deltaTime) {
        // Update all entities
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(deltaTime);
            }
        }
        
        // Animate title
        this.title.rotation += deltaTime * 0.2;
        
        // Check for button click
        if (this.engine && this.engine.input.isMouseButtonDown('left')) {
            const mousePos = this.engine.input.getMousePosition();
            
            if (window.Utils.pointInRect(
                mousePos.x, mousePos.y,
                this.startButton.position.x - this.startButton.width / 2,
                this.startButton.position.y - this.startButton.height / 2,
                this.startButton.width,
                this.startButton.height
            )) {
                // Start game when button is clicked
                if (typeof window.startGame === 'function') {
                    window.startGame();
                }
            }
        }
    }
    
    findEntityByName(name) {
        return this.entities.find(entity => entity.name === name);
    }
    
    findEntitiesByTag(tag) {
        return this.entities.filter(entity => entity.tag === tag);
    }
}

class GameLevelScene {
    constructor() {
        // Create a new Scene instance
        this.scene = new THREE.Scene();
        this.name = 'gameLevel';
        this.entities = [];
        this.engine = null;
        
        // Game state
        this.score = 0;
        this.gameOver = false;
    }
    
    setEngine(engine) {
        this.engine = engine;
        // Create level after engine is set
        this.createLevel();
    }
    
    add(entity) {
        this.entities.push(entity);
        this.scene.add(entity.mesh);
        
        // Add to physics system if enabled
        if (this.engine && entity.physics && entity.physics.enabled) {
            this.engine.physics.addEntity(entity);
        }
        
        return entity;
    }
    
    remove(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
            this.scene.remove(entity.mesh);
            
            // Remove from physics system
            if (this.engine && entity.physics && entity.physics.enabled) {
                this.engine.physics.removeEntity(entity);
            }
        }
    }
    
    createLevel() {
        // Create ground
        const ground = new Sprite({
            width: 2000,
            height: 50,
            color: 0x8e44ad,
            position: { x: 0, y: 200 },
            tag: 'ground',
            name: 'ground'
        });
        
        ground.enablePhysics({
            useGravity: false,
            solid: true
        });
        
        ground.createCollider();
        this.add(ground);
        
        // Create platforms
        this.createPlatform(-300, 50, 200, 30);
        this.createPlatform(0, -50, 200, 30);
        this.createPlatform(300, 0, 200, 30);
        
        // Create player
        const player = new Sprite({
            width: 64,
            height: 64,
            color: 0x3498db,
            position: { x: -400, y: -100 },
            name: 'player',
            tag: 'player'
        });
        
        player.enablePhysics({
            useGravity: true,
            friction: 0.1,
            bounciness: 0.1
        });
        
        player.createCollider(player.width * 0.8, player.height * 0.8);
        
        // Add player-specific properties
        player.speed = 200;
        player.jumpForce = 400;
        player.health = 100;
        player.score = 0;
        player.isJumping = false;
        
        // Add player-specific update method
        const originalUpdate = player.update;
        player.update = (deltaTime) => {
            // Handle input if engine is available
            if (this.engine) {
                const input = this.engine.input;
                
                // Movement
                let moveX = 0;
                
                if (input.isKeyDown('ArrowLeft') || input.isKeyDown('KeyA')) {
                    moveX = -1;
                } else if (input.isKeyDown('ArrowRight') || input.isKeyDown('KeyD')) {
                    moveX = 1;
                }
                
                // Apply movement
                player.physics.velocity.x = moveX * player.speed;
                
                // Jump
                if ((input.isKeyDown('ArrowUp') || input.isKeyDown('KeyW') || input.isKeyDown('Space')) && !player.isJumping) {
                    player.physics.velocity.y = -player.jumpForce;
                    player.isJumping = true;
                }
            }
            
            // Check if on ground
            if (player.position.y >= 0) {
                player.position.y = 0;
                player.physics.velocity.y = 0;
                player.isJumping = false;
            }
            
            // Call original update
            if (originalUpdate) {
                originalUpdate.call(player, deltaTime);
            }
        };
        
        this.add(player);
        
        // Create enemies
        this.createEnemy(300, 0);
        this.createEnemy(-100, -50);
        this.createEnemy(0, 200);
        
        // Add collectibles
        this.createCollectible(-200, -100);
        this.createCollectible(100, -150);
        this.createCollectible(400, -50);
    }
    
    createPlatform(x, y, width, height) {
        const platform = new Sprite({
            width: width,
            height: height,
            color: 0x27ae60,
            position: { x: x, y: y },
            tag: 'platform'
        });
        
        platform.enablePhysics({
            useGravity: false,
            solid: true
        });
        
        platform.createCollider();
        this.add(platform);
        
        return platform;
    }
    
    createEnemy(x, y) {
        const enemy = new Sprite({
            width: 48,
            height: 48,
            color: 0xe74c3c,
            position: { x: x, y: y },
            name: 'enemy',
            tag: 'enemy'
        });
        
        enemy.enablePhysics({
            useGravity: true,
            friction: 0.1
        });
        
        enemy.createCollider(enemy.width * 0.8, enemy.height * 0.8);
        
        // Add enemy-specific properties
        enemy.speed = 100;
        enemy.damage = 10;
        enemy.health = 30;
        enemy.scoreValue = 100;
        enemy.patrolDistance = 200;
        enemy.startX = enemy.position.x;
        enemy.direction = 1;
        
        // Add enemy-specific update method
        const originalUpdate = enemy.update;
        enemy.update = (deltaTime) => {
            // Simple patrol AI
            enemy.physics.velocity.x = enemy.speed * enemy.direction;
            
            // Change direction at patrol boundaries
            if (enemy.position.x > enemy.startX + enemy.patrolDistance) {
                enemy.direction = -1;
            } else if (enemy.position.x < enemy.startX - enemy.patrolDistance) {
                enemy.direction = 1;
            }
            
            // Check if on ground
            if (enemy.position.y >= 0) {
                enemy.position.y = 0;
                enemy.physics.velocity.y = 0;
            }
            
            // Call original update
            originalUpdate.call(enemy, deltaTime);
        };
        
        this.add(enemy);
        
        return enemy;
    }
    
    createCollectible(x, y) {
        const collectible = new Sprite({
            width: 30,
            height: 30,
            color: 0xf1c40f,
            position: { x: x, y: y },
            tag: 'collectible'
        });
        
        collectible.enablePhysics({
            useGravity: false,
            solid: false
        });
        
        collectible.createCollider();
        
        // Add collect method
        collectible.collect = () => {
            this.score += 10;
            this.updateScore(this.score);
            this.remove(collectible);
        };
        
        this.add(collectible);
        
        return collectible;
    }
    
    updateScore(score) {
        this.score = score;
        if (typeof window.updateScore === 'function') {
            window.updateScore(score);
        }
    }
    
    onPlayerDeath() {
        this.gameOver = true;
        if (typeof window.showGameOver === 'function') {
            window.showGameOver(this.score);
        }
    }
    
    onEnter() {
        console.log('Entered game level scene');
        
        // Reset game state
        this.score = 0;
        this.gameOver = false;
        
        // Reset UI
        if (typeof window.updateScore === 'function') {
            window.updateScore(0);
        }
        
        if (typeof window.updateHealth === 'function') {
            window.updateHealth(100);
        }
    }
    
    onExit() {
        // Called when scene is no longer active
    }
    
    update(deltaTime) {
        if (!this.gameOver) {
            // Update all entities
            for (const entity of this.entities) {
                if (typeof entity.update === 'function') {
                    entity.update(deltaTime);
                }
            }
        }
    }
    
    findEntityByName(name) {
        return this.entities.find(entity => entity.name === name);
    }
    
    findEntitiesByTag(tag) {
        return this.entities.filter(entity => entity.tag === tag);
    }
}

// Make classes globally available
window.MainMenuScene = MainMenuScene;
window.GameLevelScene = GameLevelScene;

// Export any needed functions
export { MainMenuScene, GameLevelScene }; 