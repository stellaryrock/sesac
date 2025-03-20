/**
 * Space Environment System
 * Main coordinator for the space environment
 */
import * as THREE from 'three';
import { createStarfield } from '../entities/starfield.js';
import { createNebulae } from '../entities/nebulae.js';
import { createDustClouds } from '../entities/dustClouds.js';
import { createPlanets } from '../entities/planets.js';
import { createSkybox } from '../entities/skybox.js';
import { createStellarPhenomenon } from '../entities/stellar.js';
import { createSplender } from '../entities/splender.js';
import { createSpaceship } from '../entities/spaceship.js';

export const spaceSystem = {
  name: 'space',
  
  // System state
  entities: {},
  
  // Initialize the system
  init(engine) {
    console.log('Initializing space system');
    this.engine = engine;
    
    // Create all space entities
    this.entities.stars = createStarfield(engine);
    this.entities.nebulae = createNebulae(engine);
    this.entities.dustClouds = createDustClouds(engine);
    this.entities.planets = createPlanets(engine);
    this.entities.skybox = createSkybox(engine);
    this.entities.stellar = createStellarPhenomenon(engine);
    this.entities.splender = createSplender(engine);

    this.entities.spaceship = createSpaceship(engine);

    // Add all entities to the scene
    Object.entries(this.entities).forEach(([key, entity]) => {
      console.log(`Adding ${key} to scene`);
      if (Array.isArray(entity)) {
        entity.forEach(item => {
          engine.scene.add(item);
          console.log(`Added array item to scene`);
        });
      } else if (entity) {
        engine.scene.add(entity);
        console.log(`Added ${key} to scene`);
      }
    });
    
    console.log('Space system initialized');
  },
  
  // Update system
  update(deltaTime, engine) {
    // Update time uniforms for animations
    const updateTimeUniform = (object) => {
      if (object && object.material && object.material.uniforms && object.material.uniforms.time) {
        object.material.uniforms.time.value += deltaTime;
      }
    };
    
    // Update stars
    updateTimeUniform(this.entities.stars);
    
    // Update nebulae
    if (Array.isArray(this.entities.nebulae)) {
      this.entities.nebulae.forEach(updateTimeUniform);
    }
    
    // Update dust clouds
    updateTimeUniform(this.entities.dustClouds);
    
    // Update planets
    if (Array.isArray(this.entities.planets)) {
      this.entities.planets.forEach(updateTimeUniform);
    }
    
    // Update stellar phenomenon
    updateTimeUniform(this.entities.stellar);
    
    // Slowly rotate the stars
    if (this.entities.stars) {
      this.entities.stars.rotation.y += deltaTime * 0.01;
    }
    
    // Animate the stellar phenomenon
    if (this.entities.stellar) {
      this.entities.stellar.rotation.y += deltaTime * 0.05;
      this.entities.stellar.rotation.x += deltaTime * 0.03;
    }

    // Animate the splender phenomenon
    if (this.entities.splender) {
      this.entities.splender.rotation.y += deltaTime * 0.05;
      this.entities.splender.rotation.x += deltaTime * 0.03;
    }

    // Animate the spaceship
    if (this.entities.spaceship) {
      this.entities.spaceship.rotation.y += deltaTime * 0.05;
      this.entities.spaceship.rotation.x += deltaTime * 0.03;
    }
  }
};