import { createEntity } from './entity.js';

/**
 * Building interface for RTS game
 */
const BuildingInterface = {
  // Building-specific properties
  width: Number,
  height: Number,
  buildProgress: Number,
  buildCost: Number,
  isBuilt: Boolean,
  productionQueue: Array,
  productionProgress: Number,
  productionType: String,
  resources: Object,
  
  // Building-specific methods
  build: (amount) => {},
  addToQueue: (unitType) => {},
  getProductionTypes: () => [],
  getProductionCost: (unitType) => Number,
  addResource: (type, amount) => {},
  produceUnit: (gameState) => {}
};

// Building types data
const BUILDING_TYPES = {
  BASE: {
    type: 'base',
    width: 3,
    height: 3,
    health: 1000,
    maxHealth: 1000,
    buildCost: 200,
    productionTypes: ['worker'],
    color: 0x3498db,
    description: 'Main base building. Can produce workers.'
  },
  BARRACKS: {
    type: 'barracks',
    width: 2,
    height: 2,
    health: 500,
    maxHealth: 500,
    buildCost: 150,
    productionTypes: ['soldier', 'archer'],
    color: 0xe74c3c,
    description: 'Military building. Can produce combat units.'
  },
  STABLE: {
    type: 'stable',
    width: 2,
    height: 3,
    health: 400,
    maxHealth: 400,
    buildCost: 180,
    productionTypes: ['cavalry'],
    color: 0xf39c12,
    description: 'Produces mounted units.'
  },
  TOWER: {
    type: 'tower',
    width: 1,
    height: 1,
    health: 300,
    maxHealth: 300,
    buildCost: 120,
    productionTypes: [],
    color: 0x95a5a6,
    description: 'Defensive structure. Attacks nearby enemies.'
  },
  FARM: {
    type: 'farm',
    width: 2,
    height: 2,
    health: 200,
    maxHealth: 200,
    buildCost: 100,
    productionTypes: [],
    color: 0x2ecc71,
    description: 'Generates food resources over time.'
  }
};

// Factory function for creating buildings
const createBuilding = (config) => {
  const buildingType = BUILDING_TYPES[config.type.toUpperCase()] || BUILDING_TYPES.BASE;
  
  // Create base entity
  const building = createEntity({
    ...config,
    health: buildingType.health,
    maxHealth: buildingType.maxHealth,
    zIndex: 0.5 // Buildings are above terrain but below units
  });
  
  // Add building-specific properties
  return {
    ...building,
    width: buildingType.width,
    height: buildingType.height,
    buildProgress: config.buildProgress || 0,
    buildCost: buildingType.buildCost,
    isBuilt: config.isBuilt || false,
    productionQueue: [],
    productionProgress: 0,
    productionType: null,
    resources: {
      gold: 0,
      wood: 0,
      stone: 0,
      food: 0
    },
    
    // Create visual representation
    render(scene) {
      if (this.mesh) return;
      
      const tileSize = 32;
      const geometry = new THREE.PlaneGeometry(
        this.width * tileSize,
        this.height * tileSize
      );
      
      // Color based on player and building type
      const playerColors = [
        0x0000ff, // Blue
        0xff0000, // Red
        0x00ff00, // Green
        0xffff00  // Yellow
      ];
      
      const baseColor = playerColors[this.player % playerColors.length];
      const buildingColor = buildingType.color;
      
      // Mix colors
      const color = new THREE.Color(baseColor).lerp(new THREE.Color(buildingColor), 0.5);
      
      const material = new THREE.MeshBasicMaterial({ 
        color: color.getHex(),
        transparent: true,
        opacity: this.isBuilt ? 1.0 : 0.5
      });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.position.x, this.position.y, 0.5);
      
      // Add selection indicator
      this.createSelectionIndicator();
      
      // Add health bar
      this.createHealthBar();
      
      // Add build progress bar if not built
      if (!this.isBuilt) {
        this.createBuildBar();
      }
      
      // Store reference to this building
      this.mesh.userData.entity = this;
      
      scene.add(this.mesh);
    },
    
    createSelectionIndicator() {
      const tileSize = 32;
      const selectionGeometry = new THREE.RingGeometry(
        Math.max(this.width, this.height) * tileSize * 0.6,
        Math.max(this.width, this.height) * tileSize * 0.65,
        32
      );
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
      const healthBarWidth = this.width * 32;
      const healthBarHeight = 4;
      
      // Background
      const bgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.healthBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
      this.healthBarBg.position.set(0, this.height * 16 + 8, 0.1);
      this.mesh.add(this.healthBarBg);
      
      // Foreground (health)
      const fgGeometry = new THREE.PlaneGeometry(healthBarWidth, healthBarHeight);
      const fgMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.healthBarFg = new THREE.Mesh(fgGeometry, fgMaterial);
      this.healthBarFg.position.set(0, 0, 0.1);
      this.healthBarBg.add(this.healthBarFg);
      
      this.updateHealthBar();
    },
    
    createBuildBar() {
      const buildBarWidth = this.width * 32;
      const buildBarHeight = 4;
      
      // Background
      const bgGeometry = new THREE.PlaneGeometry(buildBarWidth, buildBarHeight);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      this.buildBarBg = new THREE.Mesh(bgGeometry, bgMaterial);
      this.buildBarBg.position.set(0, this.height * 16 + 16, 0.1);
      this.mesh.add(this.buildBarBg);
      
      // Foreground (build progress)
      const fgGeometry = new THREE.PlaneGeometry(buildBarWidth, buildBarHeight);
      const fgMaterial = new THREE.MeshBasicMaterial({ color: 0xf39c12 });
      this.buildBarFg = new THREE.Mesh(fgGeometry, fgMaterial);
      this.buildBarFg.position.set(0, 0, 0.1);
      this.buildBarBg.add(this.buildBarFg);
      
      this.updateBuildBar();
    },
    
    updateHealthBar() {
      if (!this.healthBarFg) return;
      
      const healthPercent = this.health / this.maxHealth;
      this.healthBarFg.scale.x = healthPercent;
      this.healthBarFg.position.x = (healthPercent - 1) * (this.width * 16);
    },
    
    updateBuildBar() {
      if (!this.buildBarFg) return;
      
      const buildPercent = this.buildProgress / this.buildCost;
      this.buildBarFg.scale.x = buildPercent;
      this.buildBarFg.position.x = (buildPercent - 1) * (this.width * 16);
    },
    
    build(amount) {
      if (this.isBuilt) return false;
      
      this.buildProgress += amount;
      this.updateBuildBar();
      
      if (this.buildProgress >= this.buildCost) {
        this.isBuilt = true;
        
        // Update appearance
        if (this.mesh && this.mesh.material) {
          this.mesh.material.opacity = 1.0;
        }
        
        // Remove build bar
        if (this.buildBarBg) {
          this.mesh.remove(this.buildBarBg);
          this.buildBarBg = null;
          this.buildBarFg = null;
        }
        
        return true;
      }
      
      return false;
    },
    
    addToQueue(unitType) {
      if (!this.isBuilt) return false;
      
      // Check if this building can produce this unit type
      const canProduce = this.getProductionTypes().includes(unitType);
      if (!canProduce) return false;
      
      // Add to queue
      this.productionQueue.push(unitType);
      
      // If not currently producing, start production
      if (!this.productionType) {
        this.startNextProduction();
      }
      
      return true;
    },
    
    startNextProduction() {
      if (this.productionQueue.length === 0) {
        this.productionType = null;
        this.productionProgress = 0;
        return;
      }
      
      this.productionType = this.productionQueue.shift();
      this.productionProgress = 0;
    },
    
    getProductionTypes() {
      return buildingType.productionTypes;
    },
    
    getProductionCost(unitType) {
      // Return cost to produce unit
      const costs = {
        worker: 50,
        soldier: 100,
        archer: 120,
        cavalry: 150
      };
      
      return costs[unitType] || 0;
    },
    
    addResource(type, amount) {
      if (this.resources[type] !== undefined) {
        this.resources[type] += amount;
        
        // Notify game manager
        if (typeof window.onResourceCollected === 'function') {
          window.onResourceCollected(type, amount);
        }
      }
    },
    
    update(deltaTime, gameState) {
      // Call parent update
      super.update(deltaTime, gameState);
      
      // Update production if building is complete
      if (this.isBuilt && this.productionType) {
        const productionCost = this.getProductionCost(this.productionType);
        const productionRate = 20; // Units per second
        
        this.productionProgress += productionRate * deltaTime;
        
        if (this.productionProgress >= productionCost) {
          // Production complete
          this.produceUnit(gameState);
          this.startNextProduction();
        }
      }
    },
    
    produceUnit(gameState) {
      if (!this.productionType || !gameState) return;
      
      // Create unit at building position
      const spawnOffset = 64; // Spawn distance from building
      const unitOptions = {
        type: this.productionType,
        player: this.player,
        x: this.position.x,
        y: this.position.y + spawnOffset
      };
      
      // Create and add unit
      gameState.createUnit(unitOptions);
    }
  };
};

export { BuildingInterface, createBuilding, BUILDING_TYPES }; 