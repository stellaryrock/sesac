import * as THREE from 'three';
import Terrain from './core/terrain.js';
import Unit from './core/unit.js';
import Building from './core/building.js';

class RTSGame {
    constructor(container) {
        this.container = container;
        this.width = container.clientWidth;
        this.height = container.clientHeight;
        
        // Game state
        this.terrain = null;
        this.units = [];
        this.buildings = [];
        this.selectedEntities = [];
        this.playerResources = {
            gold: 500,
            wood: 300,
            stone: 200
        };
        
        // Initialize Three.js
        this.initThree();
        
        // Initialize game systems
        this.initTerrain();
        this.initInput();
        
        // Start game loop
        this.lastTime = performance.now();
        this.animate();
    }
    
    initThree() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.width, this.height);
        this.container.appendChild(this.renderer.domElement);
        
        // Create scene
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x87CEEB); // Sky blue
        
        // Create camera (orthographic for 2D)
        const aspectRatio = this.width / this.height;
        const viewSize = 1000;
        this.camera = new THREE.OrthographicCamera(
            -viewSize * aspectRatio / 2,
            viewSize * aspectRatio / 2,
            viewSize / 2,
            -viewSize / 2,
            1,
            1000
        );
        this.camera.position.z = 10;
        
        // Add ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 1);
        this.scene.add(ambientLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }
    
    initTerrain() {
        // Create terrain (30x30 grid)
        this.terrain = new Terrain(30, 30, 32);
        this.terrain.setScene(this.scene);
        
        // Add some variety to terrain
        for (let i = 0; i < 20; i++) {
            const x = Math.floor(Math.random() * 30);
            const y = Math.floor(Math.random() * 30);
            this.terrain.setTileType(x, y, 'water', false, false);
        }
        
        for (let i = 0; i < 15; i++) {
            const x = Math.floor(Math.random() * 30);
            const y = Math.floor(Math.random() * 30);
            this.terrain.setTileType(x, y, 'mountain', false, false);
        }
        
        // Add resources
        for (let i = 0; i < 10; i++) {
            const x = Math.floor(Math.random() * 30);
            const y = Math.floor(Math.random() * 30);
            const resourceType = ['gold', 'wood', 'stone'][Math.floor(Math.random() * 3)];
            const amount = Math.floor(Math.random() * 500) + 500;
            this.terrain.addResource(x, y, resourceType, amount);
        }
        
        // Render terrain
        this.terrain.render();
        
        // Add initial buildings and units
        this.createStartingBase();
    }
    
    createStartingBase() {
        // Create main base
        const baseOptions = {
            type: 'base',
            player: 0, // Player 0 (human player)
            x: 0,
            y: 0,
            isBuilt: true // Start with a completed base
        };
        
        const base = new Building(baseOptions);
        this.addBuilding(base);
        
        // Create initial workers
        for (let i = 0; i < 3; i++) {
            const workerOptions = {
                type: 'worker',
                player: 0,
                x: 50 + i * 40,
                y: 50,
                buildPower: 10,
                gatherPower: 5
            };
            
            this.createUnit(workerOptions);
        }
    }
    
    initInput() {
        // Mouse state
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            startX: 0,
            startY: 0,
            isDragging: false
        };
        
        // Selection box
        this.selectionBox = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1),
            new THREE.MeshBasicMaterial({
                color: 0xffffff,
                transparent: true,
                opacity: 0.2,
                side: THREE.DoubleSide
            })
        );
        this.selectionBox.visible = false;
        this.scene.add(this.selectionBox);
        
        // Selection box outline
        this.selectionBoxOutline = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.PlaneGeometry(1, 1)),
            new THREE.LineBasicMaterial({ color: 0xffffff })
        );
        this.selectionBoxOutline.visible = false;
        this.scene.add(this.selectionBoxOutline);
        
        // Add event listeners
        const canvas = this.renderer.domElement;
        
        canvas.addEventListener('mousedown', (e) => this.onMouseDown(e));
        canvas.addEventListener('mousemove', (e) => this.onMouseMove(e));
        canvas.addEventListener('mouseup', (e) => this.onMouseUp(e));
        canvas.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.onRightClick(e);
        });
    }
    
    onMouseDown(event) {
        event.preventDefault();
        
        // Only handle left mouse button
        if (event.button !== 0) return;
        
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.startX = event.clientX - rect.left;
        this.mouse.startY = event.clientY - rect.top;
        this.mouse.isDown = true;
        this.mouse.isDragging = false;
    }
    
    onMouseMove(event) {
        const rect = this.renderer.domElement.getBoundingClientRect();
        this.mouse.x = event.clientX - rect.left;
        this.mouse.y = event.clientY - rect.top;
        
        if (this.mouse.isDown) {
            // Update selection box
            this.mouse.isDragging = true;
            this.updateSelectionBox();
        }
    }
    
    onMouseUp(event) {
        // Only handle left mouse button
        if (event.button !== 0) return;
        
        if (this.mouse.isDragging) {
            // Select units within box
            this.selectUnitsInBox();
        } else {
            // Single click selection
            this.selectEntityAtMouse();
        }
        
        this.mouse.isDown = false;
        this.mouse.isDragging = false;
        this.selectionBox.visible = false;
        this.selectionBoxOutline.visible = false;
    }
    
    onRightClick(event) {
        // Get world position of click
        const worldPos = this.screenToWorld(this.mouse.x, this.mouse.y);
        
        // Check if clicked on an entity
        const entity = this.getEntityAtPosition(worldPos.x, worldPos.y);
        
        if (entity) {
            if (entity instanceof Building) {
                // If building belongs to player, select it
                if (entity.player === 0) {
                    this.clearSelection();
                    this.addToSelection(entity);
                } else {
                    // Enemy building - attack it
                    this.commandSelectedUnits('attack', entity);
                }
            } else if (entity instanceof Unit) {
                // If unit belongs to player, select it
                if (entity.player === 0) {
                    this.clearSelection();
                    this.addToSelection(entity);
                } else {
                    // Enemy unit - attack it
                    this.commandSelectedUnits('attack', entity);
                }
            }
        } else {
            // Move selected units to position
            this.commandSelectedUnits('move', worldPos);
        }
    }
    
    updateSelectionBox() {
        if (!this.mouse.isDragging) return;
        
        // Make selection box visible
        this.selectionBox.visible = true;
        this.selectionBoxOutline.visible = true;
        
        // Calculate box dimensions
        const minX = Math.min(this.mouse.startX, this.mouse.x);
        const maxX = Math.max(this.mouse.startX, this.mouse.x);
        const minY = Math.min(this.mouse.startY, this.mouse.y);
        const maxY = Math.max(this.mouse.startY, this.mouse.y);
        const width = maxX - minX;
        const height = maxY - minY;
        
        // Convert to world coordinates
        const startWorld = this.screenToWorld(minX, minY);
        const endWorld = this.screenToWorld(maxX, maxY);
        const worldWidth = endWorld.x - startWorld.x;
        const worldHeight = endWorld.y - startWorld.y;
        
        // Update selection box
        this.selectionBox.scale.set(worldWidth, worldHeight, 1);
        this.selectionBox.position.set(
            startWorld.x + worldWidth / 2,
            startWorld.y + worldHeight / 2,
            0.1
        );
        
        // Update outline
        this.selectionBoxOutline.scale.set(worldWidth, worldHeight, 1);
        this.selectionBoxOutline.position.copy(this.selectionBox.position);
    }
    
    selectUnitsInBox() {
        // Calculate box in screen coordinates
        const minX = Math.min(this.mouse.startX, this.mouse.x);
        const maxX = Math.max(this.mouse.startX, this.mouse.x);
        const minY = Math.min(this.mouse.startY, this.mouse.y);
        const maxY = Math.max(this.mouse.startY, this.mouse.y);
        
        // Convert to world coordinates
        const startWorld = this.screenToWorld(minX, minY);
        const endWorld = this.screenToWorld(maxX, maxY);
        
        // Clear current selection
        this.clearSelection();
        
        // Select player units within box
        for (const unit of this.units) {
            if (unit.player === 0 && // Only select player's units
                unit.position.x >= startWorld.x &&
                unit.position.x <= endWorld.x &&
                unit.position.y >= startWorld.y &&
                unit.position.y <= endWorld.y) {
                this.addToSelection(unit);
            }
        }
    }
    
    selectEntityAtMouse() {
        const worldPos = this.screenToWorld(this.mouse.x, this.mouse.y);
        const entity = this.getEntityAtPosition(worldPos.x, worldPos.y);
        
        // Clear current selection
        this.clearSelection();
        
        if (entity && (entity.player === 0 || entity instanceof Building)) {
            this.addToSelection(entity);
        }
    }
    
    getEntityAtPosition(x, y) {
        // Check buildings first (they're bigger)
        for (const building of this.buildings) {
            const halfWidth = building.width * 16;
            const halfHeight = building.height * 16;
            
            if (x >= building.position.x - halfWidth &&
                x <= building.position.x + halfWidth &&
                y >= building.position.y - halfHeight &&
                y <= building.position.y + halfHeight) {
                return building;
            }
        }
        
        // Then check units
        for (const unit of this.units) {
            const distance = Math.sqrt(
                Math.pow(unit.position.x - x, 2) +
                Math.pow(unit.position.y - y, 2)
            );
            
            if (distance <= 16) { // Unit radius
                return unit;
            }
        }
        
        return null;
    }
    
    clearSelection() {
        for (const entity of this.selectedEntities) {
            entity.setSelected(false);
        }
        this.selectedEntities = [];
    }
    
    addToSelection(entity) {
        entity.setSelected(true);
        this.selectedEntities.push(entity);
    }
    
    commandSelectedUnits(command, target) {
        for (const entity of this.selectedEntities) {
            if (entity instanceof Unit) {
                switch (command) {
                    case 'move':
                        entity.moveTo(target.x, target.y, this.terrain);
                        break;
                    case 'attack':
                        entity.attack(target);
                        break;
                    case 'build':
                        entity.build(target);
                        break;
                    case 'gather':
                        entity.gather(target);
                        break;
                }
            }
        }
    }
    
    screenToWorld(screenX, screenY) {
        // Convert screen coordinates to normalized device coordinates
        const rect = this.renderer.domElement.getBoundingClientRect();
        const x = (screenX / rect.width) * 2 - 1;
        const y = -(screenY / rect.height) * 2 + 1;
        
        // Create a ray from the camera
        const vector = new THREE.Vector3(x, y, 0);
        vector.unproject(this.camera);
        
        return { x: vector.x, y: vector.y };
    }
    
    onWindowResize() {
        this.width = this.container.clientWidth;
        this.height = this.container.clientHeight;
        
        // Update camera
        const aspectRatio = this.width / this.height;
        const viewSize = 1000;
        this.camera.left = -viewSize * aspectRatio / 2;
        this.camera.right = viewSize * aspectRatio / 2;
        this.camera.top = viewSize / 2;
        this.camera.bottom = -viewSize / 2;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(this.width, this.height);
    }
    
    createUnit(options) {
        const unit = new Unit(options);
        this.addUnit(unit);
        return unit;
    }
    
    addUnit(unit) {
        this.units.push(unit);
        this.scene.add(unit.mesh);
    }
    
    removeUnit(unit) {
        const index = this.units.indexOf(unit);
        if (index !== -1) {
            this.units.splice(index, 1);
            this.scene.remove(unit.mesh);
            
            // Remove from selection if selected
            const selIndex = this.selectedEntities.indexOf(unit);
            if (selIndex !== -1) {
                this.selectedEntities.splice(selIndex, 1);
            }
        }
    }
    
    addBuilding(building) {
        this.buildings.push(building);
        this.scene.add(building.mesh);
    }
    
    removeBuilding(building) {
        const index = this.buildings.indexOf(building);
        if (index !== -1) {
            this.buildings.splice(index, 1);
            this.scene.remove(building.mesh);
            
            // Remove from selection if selected
            const selIndex = this.selectedEntities.indexOf(building);
            if (selIndex !== -1) {
                this.selectedEntities.splice(selIndex, 1);
            }
        }
    }
    
    update(deltaTime) {
        // Update units
        for (const unit of this.units) {
            // Update mesh position
            unit.mesh.position.set(unit.position.x, unit.position.y, 1);
            
            // Update unit logic
            unit.update(deltaTime, this);
        }
        
        // Update buildings
        for (const building of this.buildings) {
            building.update(deltaTime, this);
        }
    }
    
    animate() {
        requestAnimationFrame(() => this.animate());
        
        const now = performance.now();
        const deltaTime = (now - this.lastTime) / 1000; // Convert to seconds
        this.lastTime = now;
        
        // Update game state
        this.update(deltaTime);
        
        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

export default RTSGame; 