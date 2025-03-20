import { createEntity } from './entity.js';

/**
 * Unit interface for RTS game
 */
const UnitInterface = {
  // Unit-specific properties
  speed: Number,
  attack: Number,
  defense: Number,
  range: Number,
  buildPower: Number,
  gatherPower: Number,
  carryingResource: String,
  carryingAmount: Number,
  state: String,
  target: Object,
  targetPosition: Object,
  path: Array,
  
  // Unit-specific methods
  moveTo: (x, y) => {},
  attack: (target) => {},
  build: (target) => {},
  gather: (target) => {},
  returnResources: (target) => {}
};

// Unit types data
const UNIT_TYPES = {
  WORKER: {
    type: 'worker',
    health: 50,
    maxHealth: 50,
    speed: 100,
    attack: 5,
    defense: 0,
    range: 1,
    buildPower: 10,
    gatherPower: 5,
    color: 0xf1c40f,
    description: 'Basic worker unit. Can gather resources and construct buildings.'
  },
  SOLDIER: {
    type: 'soldier',
    health: 100,
    maxHealth: 100,
    speed: 80,
    attack: 15,
    defense: 10,
    range: 1,
    buildPower: 0,
    gatherPower: 0,
    color: 0xe74c3c,
    description: 'Basic melee combat unit.'
  },
  ARCHER: {
    type: 'archer',
    health: 70,
    maxHealth: 70,
    speed: 90,
    attack: 12,
    defense: 5,
    range: 5,
    buildPower: 0,
    gatherPower: 0,
    color: 0x9b59b6,
    description: 'Ranged combat unit.'
  },
  CAVALRY: {
    type: 'cavalry',
    health: 120,
    maxHealth: 120,
    speed: 150,
    attack: 20,
    defense: 8,
    range: 1,
    buildPower: 0,
    gatherPower: 0,
    color: 0x3498db,
    description: 'Fast melee unit.'
  }
};

// Factory function for creating units
const createUnit = (config) => {
  const unitType = UNIT_TYPES[config.type.toUpperCase()] || UNIT_TYPES.WORKER;
  
  // Create base entity
  const unit = createEntity({
    ...config,
    health: unitType.health,
    maxHealth: unitType.maxHealth,
    zIndex: 1 // Units are above terrain and buildings
  });
  
  // Add unit-specific properties
  return {
    ...unit,
    speed: unitType.speed,
    attack: unitType.attack,
    defense: unitType.defense,
    range: unitType.range,
    buildPower: unitType.buildPower,
    gatherPower: unitType.gatherPower,
    carryingResource: null,
    carryingAmount: 0,
    state: 'idle', // idle, moving, attacking, building, gathering, returning
    target: null,
    targetPosition: null,
    path: [],
    
    // Create visual representation
    render(scene) {
      if (this.mesh) return;
      
      // Create a simple circle for the unit
      const geometry = new THREE.CircleGeometry(16, 32);
      
      // Color based on player and unit type
      const playerColors = [
        0x0000ff, // Blue
        0xff0000, // Red
        0x00ff00, // Green
        0xffff00  // Yellow
      ];
      
      const baseColor = playerColors[this.player % playerColors.length];
      const unitColor = unitType.color;
      
      // Mix colors
      const color = new THREE.Color(baseColor).lerp(new THREE.Color(unitColor), 0.5);
      
      const material = new THREE.MeshBasicMaterial({ color: color.getHex() });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.position.x, this.position.y, 1);
      
      // Add selection indicator
      this.createSelectionIndicator();
      
      // Add health bar
      this.createHealthBar();
      
      // Store reference to this unit
      this.mesh.userData.entity = this;
      
      scene.add(this.mesh);
    },
    
    createSelectionIndicator() {
      const selectionGeometry = new THREE.RingGeometry(18, 20, 32);
      const selectionMaterial = new THREE.MeshBasicMaterial({ 
        color: 0xffffff,
        side: THREE.DoubleSide
      });
      this.selectionMesh = new THREE.Mesh(selectionGeometry, selectionMaterial);
      this.selectionMesh.position.set(0, 0, 0.1);
      this.selectionMesh.visible = false;
      this.mesh.add(this.selectionMesh);
    },
    
    createHealthBar() {
      const healthBarWidth = 32;
      const healthBarHeight = 4;
      
      // Background
      const bgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.healthBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
      this.healthBarBg.position.set(0, 24, 0.1);
      this.mesh.add(this.healthBarBg);
      
      // Foreground (health)
      const fgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
      const fgMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.healthBarFg = new THREE.Mesh(fgGeometry, fgMaterial);
      this.healthBarFg.position.set(0, 0, 0.1);
      this.healthBarBg.add(this.healthBarFg);
      
      this.updateHealthBar();
    },
    
    updateHealthBar() {
      if (!this.healthBarFg) return;
      
      const healthPercent = this.health / this.maxHealth;
      this.healthBarFg.scale.x = healthPercent;
      this.healthBarFg.position.x = (healthPercent - 1) * 16;
    },
    
    moveTo(x, y) {
      this.targetPosition = { x, y };
      this.target = null;
      this.state = 'moving';
      this.path = []; // In a real game, you'd calculate a path here
    },
    
    attack(target) {
      this.target = target;
      this.state = 'attacking';
    },
    
    build(target) {
      if (this.buildPower <= 0) return false;
      
      this.target = target;
      this.state = 'building';
      return true;
    },
    
    gather(target) {
      if (this.gatherPower <= 0 || this.carryingResource) return false;
      
      this.target = target;
      this.state = 'gathering';
      return true;
    },
    
    returnResources(target) {
      if (!this.carryingResource) return false;
      
      this.target = target;
      this.state = 'returning';
      return true;
    },
    
    update(deltaTime, gameState) {
      // Call parent update
      super.update(deltaTime, gameState);
      
      // Update based on current state
      switch (this.state) {
        case 'idle':
          // Do nothing
          break;
        case 'moving':
          this.updateMoving(deltaTime);
          break;
        case 'attacking':
          this.updateAttacking(deltaTime);
          break;
        case 'building':
          this.updateBuilding(deltaTime);
          break;
        case 'gathering':
          this.updateGathering(deltaTime, gameState.terrain);
          break;
        case 'returning':
          this.updateReturning(deltaTime, gameState.buildings);
          break;
      }
    },
    
    updateMoving(deltaTime) {
      if (!this.targetPosition) {
        this.state = 'idle';
        return;
      }
      
      // Calculate direction to target
      const dx = this.targetPosition.x - this.position.x;
      const dy = this.targetPosition.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If we've reached the target, stop moving
      if (distance < 5) {
        this.state = 'idle';
        return;
      }
      
      // Move towards target
      const moveDistance = this.speed * deltaTime;
      this.position.x += (dx / distance) * moveDistance;
      this.position.y += (dy / distance) * moveDistance;
    },
    
    updateAttacking(deltaTime) {
      // Check if target is still valid
      if (!this.target || this.target.health <= 0) {
        this.state = 'idle';
        return;
      }
      
      // Calculate distance to target
      const dx = this.target.position.x - this.position.x;
      const dy = this.target.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If not in range, move towards target
      if (distance > this.range * 32) {
        // Move towards target
        const moveDistance = this.speed * deltaTime;
        this.position.x += (dx / distance) * moveDistance;
        this.position.y += (dy / distance) * moveDistance;
      } else {
        // In range, attack
        const attackRate = 1; // Attacks per second
        const attackDamage = this.attack;
        
        // Simple attack logic - in a real game, you'd want to add attack cooldown
        this.target.takeDamage(attackDamage * deltaTime);
      }
    },
    
    updateBuilding(deltaTime) {
      // Check if target is still valid
      if (!this.target) {
        this.state = 'idle';
        return;
      }
      
      // Calculate distance to target
      const dx = this.target.position.x - this.position.x;
      const dy = this.target.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If not in range, move towards target
      if (distance > 40) {
        // Move towards target
        const moveDistance = this.speed * deltaTime;
        this.position.x += (dx / distance) * moveDistance;
        this.position.y += (dy / distance) * moveDistance;
      } else {
        // In range, build
        this.target.build(this.buildPower * deltaTime);
      }
    },
    
    updateGathering(deltaTime, terrain) {
      // Check if already carrying resources
      if (this.carryingResource) {
        this.state = 'idle';
        return;
      }
      
      // Check if target is still valid
      if (!this.target) {
        this.state = 'idle';
        return;
      }
      
      // Calculate distance to target
      const dx = this.target.position.x - this.position.x;
      const dy = this.target.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If not in range, move towards target
      if (distance > 32) {
        // Move towards target
        const moveDistance = this.speed * deltaTime;
        this.position.x += (dx / distance) * moveDistance;
        this.position.y += (dy / distance) * moveDistance;
      } else {
        // In range, gather
        const gathered = Math.min(
          this.gatherPower * deltaTime,
          this.target.resourceAmount
        );
        
        if (gathered > 0) {
          this.target.resourceAmount -= gathered;
          this.carryingResource = this.target.resourceType;
          this.carryingAmount = gathered;
          
          // If resource is depleted, remove it
          if (this.target.resourceAmount <= 0) {
            // Remove resource from tile
            const gridPos = terrain.worldToGrid(
              this.target.position.x,
              this.target.position.y
            );
            const tile = terrain.getTile(gridPos.x, gridPos.y);
            if (tile) {
              tile.resourceType = null;
              tile.resourceAmount = 0;
              tile.buildable = true;
              terrain.updateTileMesh(gridPos.x, gridPos.y);
            }
          }
          
          this.state = 'idle';
        }
      }
    },
    
    updateReturning(deltaTime, buildings) {
      // Check if carrying resources
      if (!this.carryingResource) {
        this.state = 'idle';
        return;
      }
      
      // Check if target is still valid
      if (!this.target) {
        this.state = 'idle';
        return;
      }
      
      // Calculate distance to target
      const dx = this.target.position.x - this.position.x;
      const dy = this.target.position.y - this.position.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      
      // If not in range, move towards target
      if (distance > 40) {
        // Move towards target
        const moveDistance = this.speed * deltaTime;
        this.position.x += (dx / distance) * moveDistance;
        this.position.y += (dy / distance) * moveDistance;
      } else {
        // In range, deposit resources
        this.target.addResource(this.carryingResource, this.carryingAmount);
        this.carryingResource = null;
        this.carryingAmount = 0;
        this.state = 'idle';
      }
    }
  };
};

export { UnitInterface, createUnit, UNIT_TYPES }; 