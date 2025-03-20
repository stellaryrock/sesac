/**
 * Entity Info UI
 * Displays information about entities when hovering over them
 */
import * as THREE from 'three';

export const createEntityInfoSystem = (engine) => {
  // Create raycaster for hover detection
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Create UI element for displaying entity info
  const infoPanel = document.createElement('div');
  infoPanel.id = 'entity-info';
  infoPanel.className = 'entity-info-panel';
  infoPanel.style.display = 'none';
  document.body.appendChild(infoPanel);
  
  // Track currently hovered entity
  let hoveredEntity = null;
  let isHovering = false;
  let hoverOutlineEffect = null;
  let hoverGlowMesh = null;
  let hoverAnimationFrame = null;
  
  // Set up mouse move event listener
  document.addEventListener('mousemove', (event) => {
    // Update mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Update info panel position
    infoPanel.style.left = `${event.clientX + 15}px`;
    infoPanel.style.top = `${event.clientY + 15}px`;
    
    isHovering = true;
  });
  
  // Create outline effect for hovered entity
  const createOutlineEffect = (object) => {
    if (!object) return null;
    
    // Remove any existing outline effect
    removeOutlineEffect();
    
    // For Points objects (like stars or dust clouds)
    if (object instanceof THREE.Points) {
      // Get intersection point for better positioning
      raycaster.setFromCamera(mouse, engine.camera);
      const intersects = raycaster.intersectObject(object);
      
      if (intersects.length > 0) {
        const intersectionPoint = intersects[0].point;
        
        // Create a pulsing glow sphere at the intersection point
        const glowGeometry = new THREE.SphereGeometry(50, 16, 16);
        const glowMaterial = new THREE.MeshBasicMaterial({
          color: 0x00ffff,
          transparent: true,
          opacity: 0.3,
          side: THREE.BackSide
        });
        
        hoverGlowMesh = new THREE.Mesh(glowGeometry, glowMaterial);
        hoverGlowMesh.position.copy(intersectionPoint);
        engine.scene.add(hoverGlowMesh);
        
        // Add animation for the glow
        const pulseAnimation = () => {
          if (!hoverGlowMesh) return;
          
          hoverGlowMesh.material.opacity = 0.3 + 0.2 * Math.sin(Date.now() * 0.005);
          hoverGlowMesh.scale.setScalar(1 + 0.1 * Math.sin(Date.now() * 0.003));
          
          hoverAnimationFrame = requestAnimationFrame(pulseAnimation);
        };
        
        pulseAnimation();
        return hoverGlowMesh;
      }
    }
    
    // For regular meshes, create an outline effect
    try {
      // Clone the geometry
      const geometry = object.geometry.clone();
      
      // Determine outline color based on object type
      let outlineColor = 0x00ffff; // Default cyan
      
      if (object.geometry instanceof THREE.SphereGeometry) {
        if (object.geometry.parameters.radius > 80) {
          outlineColor = 0xffaa00; // Orange for planets
        } else {
          outlineColor = 0x00ff88; // Green for smaller celestial bodies
        }
      } else if (object.geometry instanceof THREE.TorusKnotGeometry) {
        outlineColor = 0xff00ff; // Purple for special objects
      }
      
      // Create outline material
      const outlineMaterial = new THREE.MeshBasicMaterial({
        color: outlineColor,
        side: THREE.BackSide,
        transparent: true,
        opacity: 0.6,
        depthTest: true
      });
      
      // Create outline mesh
      const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
      outlineMesh.position.copy(object.position);
      outlineMesh.rotation.copy(object.rotation);
      outlineMesh.scale.copy(object.scale.clone().multiplyScalar(1.05)); // Slightly larger
      
      // Add to scene
      engine.scene.add(outlineMesh);
      
      // Add animation for the outline
      const pulseAnimation = () => {
        if (!outlineMesh || !outlineMesh.parent) return;
        
        outlineMesh.material.opacity = 0.4 + 0.2 * Math.sin(Date.now() * 0.005);
        const pulseScale = 1.05 + 0.03 * Math.sin(Date.now() * 0.003);
        outlineMesh.scale.copy(object.scale.clone().multiplyScalar(pulseScale));
        
        hoverAnimationFrame = requestAnimationFrame(pulseAnimation);
      };
      
      pulseAnimation();
      return outlineMesh;
    } catch (error) {
      console.warn("Couldn't create outline effect:", error);
      return null;
    }
  };
  
  // Remove outline effect
  const removeOutlineEffect = () => {
    if (hoverOutlineEffect) {
      engine.scene.remove(hoverOutlineEffect);
      hoverOutlineEffect = null;
    }
    
    if (hoverGlowMesh) {
      engine.scene.remove(hoverGlowMesh);
      hoverGlowMesh = null;
    }
    
    if (hoverAnimationFrame) {
      cancelAnimationFrame(hoverAnimationFrame);
      hoverAnimationFrame = null;
    }
  };
  
  // Get entity type based on its properties
  const getEntityType = (object) => {
    if (!object) return 'Unknown';
    
    // Check for custom entity info
    if (object.entityInfo && object.entityInfo.type) {
      return object.entityInfo.type;
    }
    
    // Check geometry type
    if (object.geometry instanceof THREE.SphereGeometry) {
      if (object.geometry.parameters.radius > 80) {
        return 'Planet';
      } else {
        return 'Celestial Body';
      }
    } else if (object instanceof THREE.Points) {
      if (object.geometry.attributes.size) {
        const sizes = object.geometry.attributes.size.array;
        const maxSize = Math.max(...sizes);
        if (maxSize > 10) {
          return 'Star Cluster';
        } else {
          return 'Dust Cloud';
        }
      }
      return 'Particle System';
    } else if (object.geometry instanceof THREE.TorusKnotGeometry) {
      return 'Quantum Anomaly';
    } else if (object.geometry instanceof THREE.CylinderGeometry) {
      return 'Spaceship';
    }
    
    return 'Space Object';
  };
  
  // Get entity details
  const getEntityDetails = (object) => {
    if (!object) return {};
    
    const type = getEntityType(object);
    const position = object.position.clone();
    const distance = position.distanceTo(engine.camera.position);
    
    // Get mass if available
    let mass = 'Unknown';
    if (object.physics && object.physics.mass) {
      if (object.physics.mass > 1000) {
        mass = `${(object.physics.mass / 1000).toFixed(1)}k units`;
      } else {
        mass = `${object.physics.mass.toFixed(1)} units`;
      }
    }
    
    // Get velocity if available
    let velocity = 'Static';
    if (object.physics && object.physics.velocity) {
      const speed = object.physics.velocity.length();
      velocity = `${speed.toFixed(1)} units/s`;
    }
    
    // Get size information
    let size = 'Unknown';
    if (object.geometry instanceof THREE.SphereGeometry) {
      size = `${object.geometry.parameters.radius.toFixed(0)} units`;
    } else if (object instanceof THREE.Points && object.geometry.attributes.position) {
      const count = object.geometry.attributes.position.count;
      size = `${count} particles`;
    }
    
    return {
      type,
      distance: distance.toFixed(0),
      position: {
        x: position.x.toFixed(0),
        y: position.y.toFixed(0),
        z: position.z.toFixed(0)
      },
      mass,
      velocity,
      size
    };
  };
  
  // Update info panel content
  const updateInfoPanel = (entity) => {
    if (!entity) {
      infoPanel.style.display = 'none';
      return;
    }
    
    const details = getEntityDetails(entity);
    
    // Create HTML content based on entity type
    let htmlContent = `
      <div class="entity-title">${details.type}</div>
      <div class="entity-detail">Distance: ${details.distance} units</div>
    `;
    
    // Check for custom entity info
    if (entity.entityInfo) {
      htmlContent += `<div class="entity-title">${entity.entityInfo.name || details.type}</div>`;
      
      // Add all custom properties
      Object.entries(entity.entityInfo).forEach(([key, value]) => {
        if (key !== 'name' && key !== 'type') {
          htmlContent += `<div class="entity-detail">${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}</div>`;
        }
      });
    } 
    // Add type-specific details
    else if (details.type === 'Planet' || details.type === 'Celestial Body') {
      htmlContent += `
        <div class="entity-detail">Size: ${details.size}</div>
        <div class="entity-detail">Mass: ${details.mass}</div>
        <div class="entity-detail">Velocity: ${details.velocity}</div>
        <div class="entity-detail">Position: X:${details.position.x} Y:${details.position.y} Z:${details.position.z}</div>
      `;
    } else if (details.type === 'Star Cluster' || details.type === 'Dust Cloud') {
      htmlContent += `
        <div class="entity-detail">Particles: ${details.size}</div>
        <div class="entity-detail">Position: X:${details.position.x} Y:${details.position.y} Z:${details.position.z}</div>
      `;
    } else if (details.type === 'Spaceship') {
      htmlContent += `
        <div class="entity-detail">Class: Scout</div>
        <div class="entity-detail">Status: Active</div>
        <div class="entity-detail">Mass: ${details.mass}</div>
        <div class="entity-detail">Velocity: ${details.velocity}</div>
      `;
    } else {
      htmlContent += `
        <div class="entity-detail">Position: X:${details.position.x} Y:${details.position.y} Z:${details.position.z}</div>
        <div class="entity-detail">Mass: ${details.mass}</div>
        <div class="entity-detail">Velocity: ${details.velocity}</div>
      `;
    }
    
    infoPanel.innerHTML = htmlContent;
    infoPanel.style.display = 'block';
    
    // Call custom onHover handler if available
    if (entity.onHover) {
      entity.onHover(true);
    }
  };
  
  // Update function to be called in animation loop
  const update = () => {
    if (!isHovering || !engine.camera) return;
    
    // Update the raycaster with the current mouse position
    raycaster.setFromCamera(mouse, engine.camera);
    
    // Get all objects in the scene that can be interacted with
    const interactiveObjects = [];
    engine.scene.traverse((object) => {
      // Only include meshes and points
      if (object instanceof THREE.Mesh || object instanceof THREE.Points) {
        // Exclude skybox, outline effects, and very small objects
        if (!(object.geometry instanceof THREE.SphereGeometry && object.geometry.parameters.radius > 4000) && 
            object !== hoverOutlineEffect && 
            object !== hoverGlowMesh) {
          interactiveObjects.push(object);
        }
      }
    });
    
    // Find intersections
    const intersects = raycaster.intersectObjects(interactiveObjects, true);
    
    if (intersects.length > 0) {
      // Get the first intersected object
      const newHoveredEntity = intersects[0].object;
      
      // If hovering over a new entity, update the info panel
      if (newHoveredEntity !== hoveredEntity) {
        hoveredEntity = newHoveredEntity;
        updateInfoPanel(hoveredEntity);
        
        // Create outline effect
        hoverOutlineEffect = createOutlineEffect(hoveredEntity);
        
        // Add highlight effect to hovered entity
        if (hoveredEntity.material && !hoveredEntity._originalEmissive) {
          if (hoveredEntity.material.emissive) {
            hoveredEntity._originalEmissive = hoveredEntity.material.emissive.clone();
            hoveredEntity.material.emissive.set(0x003333);
          } else if (hoveredEntity.material.color) {
            hoveredEntity._originalColor = hoveredEntity.material.color.clone();
            hoveredEntity.material.color.multiplyScalar(1.3);
          }
        }
      }
    } else {
      // If no entity is hovered, hide the info panel
      if (hoveredEntity) {
        // Remove highlight effect
        if (hoveredEntity.material) {
          if (hoveredEntity._originalEmissive) {
            hoveredEntity.material.emissive.copy(hoveredEntity._originalEmissive);
            delete hoveredEntity._originalEmissive;
          } else if (hoveredEntity._originalColor) {
            hoveredEntity.material.color.copy(hoveredEntity._originalColor);
            delete hoveredEntity._originalColor;
          }
        }
        
        // Call custom onHover handler if available
        if (hoveredEntity.onHover) {
          hoveredEntity.onHover(false);
        }
        
        // Remove outline effect
        removeOutlineEffect();
        
        hoveredEntity = null;
        updateInfoPanel(null);
      }
    }
    
    // Reset hovering state
    isHovering = false;
  };
  
  // Clean up resources when no longer needed
  const dispose = () => {
    removeOutlineEffect();
    if (document.body.contains(infoPanel)) {
      document.body.removeChild(infoPanel);
    }
  };
  
  return { update, dispose };
}; 