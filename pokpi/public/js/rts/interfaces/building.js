/**
 * Building Interface
 * Interface for all building entities
 */
import * as THREE from 'three';
import { createEntity } from './entity.js';

// Building interface definition
export const BuildingInterface = {
  width: Number,
  height: Number,
  buildProgress: Number,
  buildCost: Number,
  isBuilt: Boolean,
  productionQueue: Array,
  productionProgress: Number,
  productionType: String,
  resources: Object,
  
  build: Function,
  addToQueue: Function,
  getProductionTypes: Function,
  getProductionCost: Function,
  addResource: Function,
  produceUnit: Function
};

// Building types data
export const BUILDING_TYPES = {
  COMMAND_CENTER: {
    type: 'commandCenter',
    width: 4,
    height: 4,
    health: 1500,
    maxHealth: 1500,
    buildCost: 400,
    productionTypes: ['drone', 'scout'],
    color: 0x3498db,
    description: 'Main space station hub. Can produce worker drones and scout ships.'
  },
  RESEARCH_LAB: {
    type: 'researchLab',
    width: 2,
    height: 2,
    health: 500,
    maxHealth: 500,
    buildCost: 150,
    productionTypes: ['upgrade'],
    color: 0x9b59b6,
    description: 'Scientific facility for researching new technologies.'
  },
  SHIPYARD: {
    type: 'shipyard',
    width: 3,
    height: 3,
    health: 800,
    maxHealth: 800,
    buildCost: 300,
    productionTypes: ['fighter', 'cruiser'],
    color: 0xe74c3c,
    description: 'Produces combat spacecraft for your fleet.'
  },
  DEFENSE_SATELLITE: {
    type: 'defenseSatellite',
    width: 1,
    height: 1,
    health: 300,
    maxHealth: 300,
    buildCost: 120,
    productionTypes: [],
    color: 0x95a5a6,
    description: 'Orbital defense platform that attacks nearby enemies.'
  },
  HYDROPONICS_BAY: {
    type: 'hydroponicsBay',
    width: 2,
    height: 2,
    health: 200,
    maxHealth: 200,
    buildCost: 100,
    productionTypes: [],
    color: 0x2ecc71,
    description: 'Generates food resources through advanced hydroponics.'
  },
  MINING_STATION: {
    type: 'miningStation',
    width: 2,
    height: 2,
    health: 300,
    maxHealth: 300,
    buildCost: 150,
    productionTypes: [],
    color: 0x7f8c8d,
    description: 'Extracts minerals from nearby asteroids.'
  },
  SOLAR_POWER_PLANT: {
    type: 'solarPowerPlant',
    width: 3,
    height: 3,
    health: 400,
    maxHealth: 400,
    buildCost: 200,
    productionTypes: [],
    description: 'Collects solar energy to power your space colony.'
  },
  WARP_GATE: {
    type: 'warpGate',
    width: 4,
    height: 4,
    health: 600,
    maxHealth: 600,
    buildCost: 500,
    productionTypes: ['transport'],
    color: 0xf39c12,
    description: 'Allows faster-than-light travel between star systems.'
  },
  SHIELD_GENERATOR: {
    type: 'shieldGenerator',
    width: 2,
    height: 2,
    health: 350,
    maxHealth: 350,
    buildCost: 250,
    productionTypes: [],
    color: 0x3498db,
    description: 'Projects a defensive shield around nearby structures.'
  }
};

// Factory function for creating buildings
export function createBuilding(config = {}) {
  // Create base entity
  const entity = createEntity(config);
  
  // Get building type configuration
  const typeKey = config.type.toUpperCase().replace(/\s+/g, '_');
  const typeConfig = BUILDING_TYPES[typeKey] || {};
  
  // Merge with building interface
  const building = {
    ...entity,
    
    // Building properties
    isBuilding: true,
    width: config.width || typeConfig.width || 1,
    height: config.height || typeConfig.height || 1,
    buildProgress: config.buildProgress !== undefined ? config.buildProgress : 100,
    buildCost: config.buildCost || typeConfig.buildCost || 100,
    isBuilt: config.isBuilt !== undefined ? config.isBuilt : true,
    productionQueue: config.productionQueue || [],
    productionProgress: config.productionProgress || 0,
    productionType: config.productionType || null,
    resources: config.resources || {},
    productionTypes: typeConfig.productionTypes || [],
    description: typeConfig.description || 'A building',
    
    // Selection handling
    setSelected(selected) {
      this.isSelected = selected;
      
      // Update visual appearance when selected
      if (this.mesh) {
        if (selected) {
          // Add selection indicator
          if (!this.selectionIndicator) {
            // Create selection ring
            const ringGeometry = new THREE.RingGeometry(
              Math.max(this.width, this.height) * 20,
              Math.max(this.width, this.height) * 22,
              32
            );
            const ringMaterial = new THREE.MeshBasicMaterial({
              color: 0x3498db,
              side: THREE.DoubleSide,
              transparent: true,
              opacity: 0.7
            });
            this.selectionIndicator = new THREE.Mesh(ringGeometry, ringMaterial);
            this.selectionIndicator.rotation.x = -Math.PI / 2; // Lay flat
            this.selectionIndicator.position.z = 1; // Slightly above ground
            this.mesh.add(this.selectionIndicator);
            
            // Animate the selection indicator
            const animate = () => {
              if (!this.isSelected || !this.selectionIndicator) return;
              
              this.selectionIndicator.rotation.z += 0.01;
              requestAnimationFrame(animate);
            };
            
            animate();
          }
        } else {
          // Remove selection indicator
          if (this.selectionIndicator) {
            this.mesh.remove(this.selectionIndicator);
            this.selectionIndicator = null;
          }
        }
      }
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
      
      const baseColor = typeConfig.color || 0x000000;
      const playerColor = playerColors[this.player] || playerColors[0];
      
      // Mix building type color with player color
      const mixedColor = new THREE.Color(baseColor).lerp(
        new THREE.Color(playerColor),
        0.3
      );
      
      const material = new THREE.MeshBasicMaterial({
        color: mixedColor,
        transparent: true,
        opacity: this.isBuilt ? 1.0 : 0.6
      });
      
      this.mesh = new THREE.Mesh(geometry, material);
      this.mesh.position.set(this.position.x, this.position.y, this.zIndex);
      
      // Add to scene
      scene.add(this.mesh);
      
      // Create health bar
      this.createHealthBar();
      
      // Create build progress bar if not built
      if (!this.isBuilt) {
        this.createBuildProgressBar();
      }
    },
    
    // Create health bar
    createHealthBar() {
      const tileSize = 32;
      const barWidth = this.width * tileSize;
      const barHeight = 5;
      
      // Background
      const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
      bgMesh.position.set(0, this.height * tileSize / 2 + 10, 0.1);
      
      // Health bar
      const healthGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
      const healthMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
      this.healthBarMesh = new THREE.Mesh(healthGeometry, healthMaterial);
      this.healthBarMesh.position.set(0, 0, 0.1);
      
      // Add to mesh
      bgMesh.add(this.healthBarMesh);
      this.mesh.add(bgMesh);
      
      // Update health bar
      this.updateHealthBar();
    },
    
    // Update health bar
    updateHealthBar() {
      if (!this.healthBarMesh) return;
      
      const healthPercent = this.health / this.maxHealth;
      this.healthBarMesh.scale.x = healthPercent;
      this.healthBarMesh.position.x = (healthPercent - 1) * (this.width * 16);
      
      // Change color based on health
      const material = this.healthBarMesh.material;
      if (healthPercent > 0.6) {
        material.color.setHex(0x00ff00); // Green
      } else if (healthPercent > 0.3) {
        material.color.setHex(0xffff00); // Yellow
      } else {
        material.color.setHex(0xff0000); // Red
      }
    },
    
    // Create build progress bar
    createBuildProgressBar() {
      const tileSize = 32;
      const barWidth = this.width * tileSize;
      const barHeight = 5;
      
      // Background
      const bgGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
      const bgMaterial = new THREE.MeshBasicMaterial({ color: 0x000000 });
      const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
      bgMesh.position.set(0, this.height * tileSize / 2 + 20, 0.1);
      
      // Progress bar
      const progressGeometry = new THREE.PlaneGeometry(barWidth, barHeight);
      const progressMaterial = new THREE.MeshBasicMaterial({ color: 0x0088ff });
      this.buildProgressMesh = new THREE.Mesh(progressGeometry, progressMaterial);
      this.buildProgressMesh.position.set(0, 0, 0.1);
      
      // Add to mesh
      bgMesh.add(this.buildProgressMesh);
      this.mesh.add(bgMesh);
      
      // Update progress bar
      this.updateBuildProgress();
    },
    
    // Update build progress bar
    updateBuildProgress() {
      if (!this.buildProgressMesh) return;
      
      const progressPercent = this.buildProgress / this.buildCost;
      this.buildProgressMesh.scale.x = progressPercent;
      this.buildProgressMesh.position.x = (progressPercent - 1) * (this.width * 16);
    },
    
    // Build the building
    build(amount) {
      if (this.isBuilt) return false;
      
      this.buildProgress += amount;
      
      // Update progress bar
      this.updateBuildProgress();
      
      // Check if building is complete
      if (this.buildProgress >= this.buildCost) {
        this.isBuilt = true;
        
        // Update appearance
        if (this.mesh) {
          this.mesh.material.opacity = 1.0;
        }
        
        // Remove build progress bar
        if (this.buildProgressMesh && this.buildProgressMesh.parent) {
          const parent = this.buildProgressMesh.parent;
          if (parent.parent) {
            parent.parent.remove(parent);
          }
          this.buildProgressMesh = null;
        }
        
        return true;
      }
      
      return false;
    },
    
    // Add unit to production queue
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
    
    // Start next production in queue
    startNextProduction() {
      if (this.productionQueue.length === 0) {
        this.productionType = null;
        this.productionProgress = 0;
        return;
      }
      
      this.productionType = this.productionQueue.shift();
      this.productionProgress = 0;
    },
    
    // Get production types this building can produce
    getProductionTypes() {
      return this.productionTypes;
    },
    
    // Get cost to produce a unit
    getProductionCost(unitType) {
      // Return cost to produce unit
      const costs = {
        worker: 50,
        scout: 75,
        soldier: 100,
        archer: 120,
        cavalry: 150
      };
      
      return costs[unitType] || 0;
    },
    
    // Add resources to building storage
    addResource(type, amount) {
      if (this.resources[type] !== undefined) {
        this.resources[type] += amount;
        
        // Notify game manager
        if (typeof window.onResourceCollected === 'function') {
          window.onResourceCollected(type, amount);
        }
      }
    },
    
    // Update building state
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
      
      // Special behavior for different building types
      switch (this.type) {
        case 'farm':
          // Farms generate food over time
          if (this.isBuilt) {
            this.resources.food += 2 * deltaTime; // 2 food per second
            
            // Notify game manager
            if (typeof window.onResourceGenerated === 'function') {
              window.onResourceGenerated('food', 2 * deltaTime);
            }
          }
          break;
          
        case 'mine':
          // Mines generate resources over time
          if (this.isBuilt) {
            this.resources.gold += 1 * deltaTime; // 1 gold per second
            
            // Notify game manager
            if (typeof window.onResourceGenerated === 'function') {
              window.onResourceGenerated('gold', 1 * deltaTime);
            }
          }
          break;
          
        case 'tower':
          // Towers attack nearby enemies
          if (this.isBuilt) {
            this.updateTowerAttack(deltaTime, gameState);
          }
          break;
      }
    },
    
    // Tower attack behavior
    updateTowerAttack(deltaTime, gameState) {
      const attackRange = 200;
      const attackDamage = 10;
      const attackCooldown = 1; // 1 second between attacks
      
      // Decrease cooldown
      if (this.attackCooldownRemaining > 0) {
        this.attackCooldownRemaining -= deltaTime;
        return;
      }
      
      // Find closest enemy
      let closestEnemy = null;
      let closestDistance = attackRange;
      
      if (gameState && gameState.entities) {
        for (const entity of gameState.entities.values()) {
          // Skip if not an enemy
          if (entity.player === this.player) continue;
          
          // Calculate distance
          const dx = entity.position.x - this.position.x;
          const dy = entity.position.y - this.position.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          // Check if in range and closer than current closest
          if (distance <= attackRange && distance < closestDistance) {
            closestEnemy = entity;
            closestDistance = distance;
          }
        }
      }
      
      // Attack if enemy found
      if (closestEnemy) {
        closestEnemy.takeDamage(attackDamage);
        this.attackCooldownRemaining = attackCooldown;
        
        // Create attack visual
        this.createAttackVisual(closestEnemy, gameState.scene);
      }
    },
    
    // Create attack visual
    createAttackVisual(target, scene) {
      if (!scene) return;
      
      // Create line geometry
      const points = [
        new THREE.Vector3(this.position.x, this.position.y, this.zIndex + 0.1),
        new THREE.Vector3(target.position.x, target.position.y, target.zIndex + 0.1)
      ];
      
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({
        color: 0xff0000,
        transparent: true,
        opacity: 0.8
      });
      
      const line = new THREE.Line(geometry, material);
      scene.add(line);
      
      // Fade out and remove
      const fadeOut = () => {
        material.opacity -= 0.05;
        
        if (material.opacity <= 0) {
          scene.remove(line);
        } else {
          requestAnimationFrame(fadeOut);
        }
      };
      
      fadeOut();
    },
    
    // Produce a unit
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
      if (typeof gameState.createUnit === 'function') {
        gameState.createUnit(unitOptions);
      }
    }
  };
  
  return building;
}

export default { BuildingInterface, createBuilding, BUILDING_TYPES };