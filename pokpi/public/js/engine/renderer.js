/**
 * Scene class for managing game scenes
 */
class Scene {
    constructor(name) {
        this.name = name;
        this.scene = new THREE.Scene();
        this.entities = [];
        this.engine = null;
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
    
    update(deltaTime) {
        // Update all entities
        for (const entity of this.entities) {
            if (typeof entity.update === 'function') {
                entity.update(deltaTime);
            }
        }
    }
    
    onEnter() {
        // Called when scene becomes active
    }
    
    onExit() {
        // Called when scene is no longer active
    }
    
    findEntityByName(name) {
        return this.entities.find(entity => entity.name === name);
    }
    
    findEntitiesByTag(tag) {
        return this.entities.filter(entity => entity.tag === tag);
    }
} 