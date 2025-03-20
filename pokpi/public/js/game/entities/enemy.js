/**
 * Enemy entity
 */
class Enemy extends Sprite {
    constructor(options = {}) {
        // Set default enemy properties
        const enemyOptions = {
            width: 48,
            height: 48,
            color: 0xe74c3c,
            name: 'enemy',
            tag: 'enemy',
            ...options
        };
        
        super(enemyOptions);
        
        // Enemy-specific properties
        this.speed = options.speed || 100;
        this.damage = options.damage || 10;
        this.health = options.health || 30;
        this.scoreValue = options.scoreValue || 100;
        this.patrolDistance = options.patrolDistance || 200;
        this.startX = this.position.x;
        this.direction = 1;
        
        // Enable physics
        this.enablePhysics({
            useGravity: true,
            friction: 0.1
        });
        
        // Create collider
        this.createCollider(this.width * 0.8, this.height * 0.8);
    }
    
    update(deltaTime) {
        // Simple patrol AI
        this.physics.velocity.x = this.speed * this.direction;
        
        // Change direction at patrol boundaries
        if (this.position.x > this.startX + this.patrolDistance) {
            this.direction = -1;
        } else if (this.position.x < this.startX - this.patrolDistance) {
            this.direction = 1;
        }
        
        // Check if on ground
        if (this.position.y >= 0) {
            this.position.y = 0;
            this.physics.velocity.y = 0;
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
        // Handle enemy death
        
        // Add score to player if available
        const player = this.scene ? this.scene.findEntityByName('player') : null;
        if (player && typeof player.addScore === 'function') {
            player.addScore(this.scoreValue);
        }
        
        // Remove from scene
        if (this.scene) {
            this.scene.remove(this);
        }
    }
    
    onCollision(other) {
        // Handle collisions with other entities
        if (other.tag === 'player') {
            // Player collision handled by player
        } else if (other.tag === 'projectile') {
            this.takeDamage(other.damage);
            other.hit();
        }
    }
} 