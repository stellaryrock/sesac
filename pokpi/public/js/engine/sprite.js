/**
 * Sprite class for 2D game objects
 */
class Sprite {
    constructor(options = {}) {
        // Default properties
        this.position = { x: 0, y: 0 };
        this.scale = { x: 1, y: 1 };
        this.rotation = 0;
        this.visible = true;
        this.layer = 0;
        
        // Apply options
        Object.assign(this, options);
        
        // Create THREE.js mesh
        this.createMesh();
        
        // Physics properties
        this.physics = {
            enabled: false,
            velocity: { x: 0, y: 0 },
            acceleration: { x: 0, y: 0 },
            useGravity: false,
            friction: 0.1,
            bounciness: 0.5,
            solid: true,
            collider: null // Will be set in createCollider
        };
    }
    
    createMesh() {
        if (this.texture) {
            // Create sprite with texture
            const texture = new THREE.TextureLoader().load(this.texture);
            const material = new THREE.SpriteMaterial({ map: texture });
            this.mesh = new THREE.Sprite(material);
        } else {
            // Create colored rectangle
            const width = this.width || 100;
            const height = this.height || 100;
            const geometry = new THREE.PlaneGeometry(width, height);
            const material = new THREE.MeshBasicMaterial({ 
                color: this.color || 0xffffff,
                transparent: true,
                opacity: this.opacity || 1
            });
            this.mesh = new THREE.Mesh(geometry, material);
            this.mesh.rotation.z = this.rotation;
        }
        
        // Set initial position
        this.mesh.position.set(this.position.x, this.position.y, this.layer || 0);
        this.mesh.scale.set(this.scale.x, this.scale.y, 1);
        this.mesh.visible = this.visible;
        
        // Store reference to this sprite
        this.mesh.userData.sprite = this;
    }
    
    createCollider(width, height, offsetX = 0, offsetY = 0) {
        this.physics.collider = {
            x: offsetX,
            y: offsetY,
            width: width || this.width || this.mesh.scale.x,
            height: height || this.height || this.mesh.scale.y
        };
    }
    
    enablePhysics(options = {}) {
        this.physics.enabled = true;
        Object.assign(this.physics, options);
        
        // Create default collider if none exists
        if (!this.physics.collider) {
            this.createCollider();
        }
    }
    
    update(deltaTime) {
        // Update mesh position from sprite position
        this.mesh.position.x = this.position.x;
        this.mesh.position.y = this.position.y;
        this.mesh.position.z = this.layer;
        
        // Update rotation
        if (this.mesh.rotation) {
            this.mesh.rotation.z = this.rotation;
        }
        
        // Update scale
        this.mesh.scale.x = this.scale.x;
        this.mesh.scale.y = this.scale.y;
        
        // Update visibility
        this.mesh.visible = this.visible;
    }
    
    setPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
    }
    
    setScale(x, y) {
        this.scale.x = x;
        this.scale.y = y || x; // If y is not provided, use x for uniform scaling
    }
    
    setRotation(angle) {
        this.rotation = angle;
    }
    
    setVisible(visible) {
        this.visible = visible;
    }
    
    setLayer(layer) {
        this.layer = layer;
    }
    
    setVelocity(x, y) {
        this.physics.velocity.x = x;
        this.physics.velocity.y = y;
    }
    
    addForce(x, y) {
        this.physics.velocity.x += x;
        this.physics.velocity.y += y;
    }
} 