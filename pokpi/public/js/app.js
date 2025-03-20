import * as THREE from 'three';
import { MainMenuScene, GameLevelScene } from './game/main.js';

// Game instance
let game = null;

// Initialize the game
export function initGame() {
    // Create game engine
    game = new GameEngine({
        width: window.innerWidth,
        height: window.innerHeight,
        backgroundColor: 0x87CEEB, // Sky blue
        parentElement: document.getElementById('game-container')
    });
    
    // Create scenes
    const mainMenu = new MainMenuScene();
    const gameLevel = new GameLevelScene();
    
    // Add scenes to game
    game.addScene('mainMenu', mainMenu);
    game.addScene('gameLevel', gameLevel);
    
    // Set active scene to main menu
    game.setActiveScene('mainMenu');
    
    // Handle window resize
    window.addEventListener('resize', () => {
        game.resize(window.innerWidth, window.innerHeight);
    });
    
    // Update loading progress
    window.updateLoadingProgress(1);
}

// Start the game
export function startGame() {
    game.setActiveScene('gameLevel');
    game.start();
}

// Restart the game
export function restartGame() {
    // Reset game level
    const gameLevel = game.scenes.get('gameLevel');
    
    // Remove all entities except ground and platforms
    const entitiesToRemove = gameLevel.entities.filter(entity => 
        entity.tag !== 'ground' && entity.tag !== 'platform'
    );
    
    for (const entity of entitiesToRemove) {
        gameLevel.remove(entity);
    }
    
    // Create new player
    const player = new Player({
        position: { x: -400, y: -100 }
    });
    
    gameLevel.add(player);
    
    // Create new enemies
    gameLevel.createEnemy(300, 0);
    gameLevel.createEnemy(-100, -50);
    gameLevel.createEnemy(0, 200);
    
    // Add new collectibles
    gameLevel.createCollectible(-200, -100);
    gameLevel.createCollectible(100, -150);
    gameLevel.createCollectible(400, -50);
    
    // Reset UI
    window.updateScore(0);
    window.updateHealth(100);
    
    // Start game
    game.start();
} 