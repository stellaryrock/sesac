/**
 * Entity interface for RTS game
 * Base interface for all game entities
 */
const EntityInterface = {
  // Required properties
  id: String,
  type: String,
  player: Number,
  position: { x: Number, y: Number },
  health: Number,
  maxHealth: Number,
  
  // Required methods
  update: (deltaTime, gameState) => {},
  takeDamage: (amount) => {},
  destroy: () => {},
  render: (scene) => {},
  setSelected: (selected) => {}
};

// Factory function for creating entities
const createEntity = (config) => {
  const entity = {
    id: config.id || Math.random().toString(36).substr(2, 9),
    type: config.type || 'generic',
    player: config.player || 0,
    position: { x: config.x || 0, y: config.y || 0 },
    health: config.health || 100,
    maxHealth: config.maxHealth || 100,
    mesh: null,
    selected: false,
    
    update(deltaTime, gameState) {
      // Base update logic
      if (this.mesh) {
        this.mesh.position.set(this.position.x, this.position.y, this.zIndex || 0);
      }
    },
    
    takeDamage(amount) {
      this.health = Math.max(0, this.health - amount);
      if (this.health <= 0) {
        this.destroy();
      }
      return this.health;
    },
    
    destroy() {
      if (this.mesh && this.mesh.parent) {
        this.mesh.parent.remove(this.mesh);
      }
    },
    
    setSelected(selected) {
      this.selected = selected;
      if (this.selectionMesh) {
        this.selectionMesh.visible = selected;
      }
    }
  };
  
  return entity;
};

export { EntityInterface, createEntity }; 