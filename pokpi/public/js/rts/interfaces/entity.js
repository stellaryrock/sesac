/**
 * Entity Interface
 * Base interface for all game entities
 */

// Entity interface definition
export const EntityInterface = {
  id: String,
  type: String,
  player: Number,
  position: { x: Number, y: Number },
  health: Number,
  maxHealth: Number,
  mesh: Object,
  selected: Boolean,
  
  update: Function,
  takeDamage: Function,
  destroy: Function,
  setSelected: Function,
  render: Function
};

// Factory function for creating entities
export const createEntity = (config = {}) => {
  return {
    id: config.id || Math.random().toString(36).substr(2, 9),
    type: config.type || 'generic',
    player: config.player || 0,
    position: { x: config.x || 0, y: config.y || 0 },
    health: config.health || 100,
    maxHealth: config.maxHealth || 100,
    mesh: null,
    selected: false,
    zIndex: config.zIndex || 0,
    
    update(deltaTime, gameState) {
      // Base update logic
      if (this.mesh) {
        this.mesh.position.set(this.position.x, this.position.y, this.zIndex);
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
    },
    
    render(scene) {
      // Base implementation - to be overridden
      if (this.mesh) return;
      
      // Create a simple placeholder mesh
      const geometry = new THREE.CircleGeometry(10, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xffffff });
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.position.x, this.position.y, this.zIndex);
      
      scene.add(this.mesh);
    }
  };
}; 