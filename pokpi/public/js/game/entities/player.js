/**
 * Player entity
 */
class Player extends Sprite {
    constructor(options = {}) {
        // Set default player properties
        const playerOptions = {
            width: 64,
            height: 64,
            color: 0x3498db,
            name: 'player',
            tag: 'player',
            ...options
        };
        
        super(playerOptions);
        
        // Player-specific properties
        this.speed = options.speed || 200;
        this.jumpForce = options.jumpForce || 400;
        this.health = options.health || 100;
        this.score = options.score || 0;
        this.isJumping = false;
        
        // Enable physics
        this.enablePhysics({
            useGravity: true,
            friction: 0.1,
            bounciness: 0.1
        });
        
        // Create collider
        this.createCollider(this.width * 0.8, this.height * 0.8);
    }
    
    update(deltaTime) {
        // Handle input if engine is available
        if (this.scene && this.scene.engine) {
            const input = this.scene.engine.input;
            
            // Movement
            let moveX = 0;
            
            if (input.isKeyDown('ArrowLeft') || input.isKeyDown('KeyA')) {
                moveX = -1;
            } else if (input.isKeyDown('ArrowRight') || input.isKeyDown('KeyD')) {
                moveX = 1;
            }
            
            // Apply movement
            this.physics.velocity.x = moveX * this.speed;
            
            // Jump
            if ((input.isKeyDown('ArrowUp') || input.isKeyDown('KeyW') || input.isKeyDown('Space')) && !this.isJumping) {
                this.physics.velocity.y = -this.jumpForce;
                this.isJumping = true;
            }
        }
        
        // Check if on ground
        if (this.position.y >= 0) {
            this.position.y = 0;
            this.physics.velocity.y = 0;
            this.isJumping = false;
        }
        
        // Call parent update
        super.update(deltaTime);
    }
    
    takeDamage(amount) {
        this.health -= amount;
        
        if (this.health <= 0) {
            this.die();
        }
    }
    
    die() {
        // Handle player death
        this.visible = false;
        
        // Emit event or call game over function
        if (this.scene && this.scene.onPlayerDeath) {
            this.scene.onPlayerDeath();
        }
    }
    
    addScore(points) {
        this.score += points;
        
        // Update UI if available
        if (this.scene && this.scene.updateScore) {
            this.scene.updateScore(this.score);
        }
    }
    
    onCollision(other) {
        // Handle collisions with other entities
        if (other.tag === 'enemy') {
            this.takeDamage(10);
        } else if (other.tag === 'collectible') {
            this.addScore(10);
            other.collect();
        }
    }
} 