/**
 * Game Level Scene
 */
class GameLevelScene extends Scene {
    constructor() {
        super('gameLevel');
        
        // Game state
        this.score = 0;
        this.gameOver = false;
        
        // Create level
        this.createLevel();
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
        const player = new Player({
            position: { x: -400, y: -100 }
        });
        
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
        const enemy = new Enemy({
            position: { x: x, y: y }
        });
        
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
    
    update(deltaTime) {
        if (!this.gameOver) {
            super.update(deltaTime);
        }
    }
}

// Export the scene class
export default GameLevelScene; 