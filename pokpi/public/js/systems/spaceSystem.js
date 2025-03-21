/**
 * Space System
 * Manages all space environment entities and their interactions
 */
import * as THREE from 'three';
import { createStarfield } from '../entities/starfield.js';
import { createNebulae } from '../entities/nebulae.js';
import { createSpaceship } from '../entities/spaceship.js';
import { createSplender } from '../entities/splender.js';

export const spaceSystem = {
  name: 'space',
  
  // System state
  entities: {},
  initialized: false,
  
  // Initialize the system
  init(engine) {
    console.log('Initializing space system');
    this.engine = engine;
    
    // Create all space entities
    this.entities.starfield = createStarfield(engine);
    //this.entities.nebulae = createNebulae(engine);
    //this.entities.splender = createSplender(engine);
    //this.entities.spaceship = createSpaceship(engine);
    
    // Add all entities to the scene
    Object.entries(this.entities).forEach(([key, entity]) => {
      console.log(`Adding ${key} to scene`);
      if (Array.isArray(entity)) {
        entity.forEach(item => {
          engine.scene.add(item);
          console.log(`Added ${key} item to scene`);
        });
      } else if (entity) {
        engine.scene.add(entity);
        console.log(`Added ${key} to scene`);
      }
    });
    
    // Register entities with the engine
    if (!engine.entities) {
      engine.entities = {};
    }
    
    // Register individual entities
    Object.entries(this.entities).forEach(([key, entity]) => {
      if (Array.isArray(entity)) {
        entity.forEach((item, index) => {
          engine.entities[`${key}_${index}`] = item;
        });
      } else if (entity) {
        engine.entities[key] = entity;
      }
    });
    
    this.initialized = true;
    console.log('Space system initialized');

    // Log all entities in the space system
    console.log('Space system entities:');
    Object.entries(this.entities).forEach(([key, entity]) => {
      if (Array.isArray(entity)) {
        console.log(`${key}: Array with ${entity.length} items`);
        entity.forEach((item, index) => {
          console.log(`  - ${key}[${index}]:`, item);
        });
      } else {
        console.log(`${key}:`, entity);
      }
    });
  },
  
  // Update system
  update(deltaTime, engine) {
    if (!this.initialized) return;
    
    // Update time uniforms for animations
    const updateTimeUniform = (object) => {
      if (object && object.material && object.material.uniforms && object.material.uniforms.time) {
        object.material.uniforms.time.value += deltaTime;
      }
    };
    
    // Update starfield
    if (this.entities.starfield) {
      updateTimeUniform(this.entities.starfield);
      this.entities.starfield.rotation.y += deltaTime * 0.005;
    }
    
    // Update nebulae
    // if (Array.isArray(this.entities.nebulae)) {
    //   this.entities.nebulae.forEach(nebula => {
    //     updateTimeUniform(nebula);
    //   });
    // }
    
    // // Update splender
    // if (this.entities.splender) {
    //   updateTimeUniform(this.entities.splender);
    //   this.entities.splender.rotation.y += deltaTime * 0.02;
    //   this.entities.splender.rotation.x += deltaTime * 0.01;
    // }
    
    // // Update spaceship
    // if (this.entities.spaceship) {
    //   // Get camera from engine
    //   const camera = engine.camera || 
    //                 (engine.getSystem('camera') ? engine.getSystem('camera').camera : null);
      
    //   // Update spaceship with camera if available
    //   if (camera && typeof this.entities.spaceship.followCamera === 'function') {
    //     this.entities.spaceship.followCamera(camera);
    //   }
    //}
  },
  
  // Reset the system
  reset() {
    console.log('Resetting space system');
    
    // Remove all entities from scene
    Object.values(this.entities).forEach(entity => {
      if (Array.isArray(entity)) {
        entity.forEach(item => {
          this.engine.scene.remove(item);
        });
      } else if (entity) {
        this.engine.scene.remove(entity);
      }
    });
    
    // Clear entities
    this.entities = {};
    this.initialized = false;
    
    // Re-initialize
    this.init(this.engine);
  }
};
