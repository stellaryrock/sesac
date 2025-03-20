/**
 * Simple 2D Physics System
 */
class PhysicsSystem {
    constructor() {
        this.entities = [];
        this.gravity = { x: 0, y: 9.8 };
    }
    
    addEntity(entity) {
        if (!this.entities.includes(entity)) {
            this.entities.push(entity);
        }
    }
    
    removeEntity(entity) {
        const index = this.entities.indexOf(entity);
        if (index !== -1) {
            this.entities.splice(index, 1);
        }
    }
    
    update(deltaTime) {
        // Apply physics to all entities
        for (const entity of this.entities) {
            if (!entity.physics || !entity.physics.enabled) continue;
            
            // Apply gravity if entity is affected by it
            if (entity.physics.useGravity) {
                entity.physics.velocity.x += this.gravity.x * deltaTime;
                entity.physics.velocity.y += this.gravity.y * deltaTime;
            }
            
            // Apply velocity
            entity.position.x += entity.physics.velocity.x * deltaTime;
            entity.position.y += entity.physics.velocity.y * deltaTime;
            
            // Apply friction
            if (entity.physics.friction > 0) {
                const friction = Math.pow(1 - entity.physics.friction, deltaTime);
                entity.physics.velocity.x *= friction;
                entity.physics.velocity.y *= friction;
            }
            
            // Check collisions
            this.checkCollisions(entity);
        }
    }
    
    checkCollisions(entity) {
        if (!entity.physics.collider) return;
        
        for (const other of this.entities) {
            if (entity === other || !other.physics || !other.physics.collider) continue;
            
            if (this.isColliding(entity, other)) {
                // Handle collision
                if (entity.onCollision) {
                    entity.onCollision(other);
                }
                
                if (other.onCollision) {
                    other.onCollision(entity);
                }
                
                // Simple collision response
                if (entity.physics.solid && other.physics.solid) {
                    this.resolveCollision(entity, other);
                }
            }
        }
    }
    
    isColliding(a, b) {
        // Simple AABB collision detection
        const aBox = a.physics.collider;
        const bBox = b.physics.collider;
        
        return (
            a.position.x + aBox.x < b.position.x + bBox.x + bBox.width &&
            a.position.x + aBox.x + aBox.width > b.position.x + bBox.x &&
            a.position.y + aBox.y < b.position.y + bBox.y + bBox.height &&
            a.position.y + aBox.y + aBox.height > b.position.y + bBox.y
        );
    }
    
    resolveCollision(a, b) {
        // Simple collision resolution - push entities apart
        const aBox = a.physics.collider;
        const bBox = b.physics.collider;
        
        // Calculate overlap
        const overlapX = Math.min(
            a.position.x + aBox.x + aBox.width - (b.position.x + bBox.x),
            b.position.x + bBox.x + bBox.width - (a.position.x + aBox.x)
        );
        
        const overlapY = Math.min(
            a.position.y + aBox.y + aBox.height - (b.position.y + bBox.y),
            b.position.y + bBox.y + bBox.height - (a.position.y + aBox.y)
        );
        
        // Resolve along the axis with the smallest overlap
        if (overlapX < overlapY) {
            if (a.position.x < b.position.x) {
                a.position.x -= overlapX / 2;
                b.position.x += overlapX / 2;
            } else {
                a.position.x += overlapX / 2;
                b.position.x -= overlapX / 2;
            }
            
            // Bounce
            const temp = a.physics.velocity.x;
            a.physics.velocity.x = b.physics.velocity.x * a.physics.bounciness;
            b.physics.velocity.x = temp * b.physics.bounciness;
        } else {
            if (a.position.y < b.position.y) {
                a.position.y -= overlapY / 2;
                b.position.y += overlapY / 2;
            } else {
                a.position.y += overlapY / 2;
                b.position.y -= overlapY / 2;
            }
            
            // Bounce
            const temp = a.physics.velocity.y;
            a.physics.velocity.y = b.physics.velocity.y * a.physics.bounciness;
            b.physics.velocity.y = temp * b.physics.bounciness;
        }
    }
} 