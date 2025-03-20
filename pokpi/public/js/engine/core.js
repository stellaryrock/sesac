/**
 * Game Engine Core
 * Handles the main game loop and scene management
 */
class GameEngine {
    constructor(config = {}) {
        // Default configuration
        this.config = {
            width: config.width || 800,
            height: config.height || 600,
            backgroundColor: config.backgroundColor || 0x000000,
            debug: config.debug || false,
            parentElement: config.parentElement || document.body
        };
        
        // Game state
        this.scenes = new Map();
        this.activeScene = null;
        this.lastTime = 0;
        this.isRunning = false;
        
        // Initialize systems
        this.initRenderer();
        this.input = new InputManager(this.renderer.domElement);
        this.physics = new PhysicsSystem();
        
        // Bind methods
        this.gameLoop = this.gameLoop.bind(this);
    }
    
    initRenderer() {
        // Create renderer
        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(this.config.width, this.config.height);
        this.renderer.setClearColor(this.config.backgroundColor);
        
        // Add to DOM
        this.config.parentElement.appendChild(this.renderer.domElement);
        
        // Create orthographic camera for 2D
        this.camera = new THREE.OrthographicCamera(
            -this.config.width / 2, this.config.width / 2,
            this.config.height / 2, -this.config.height / 2,
            0.1, 1000
        );
        this.camera.position.z = 10;
    }
    
    addScene(name, scene) {
        this.scenes.set(name, scene);
        scene.setEngine(this);
        return scene;
    }
    
    setActiveScene(name) {
        if (!this.scenes.has(name)) {
            console.error(`Scene "${name}" not found`);
            return false;
        }
        
        // Clean up previous scene if exists
        if (this.activeScene) {
            this.activeScene.onExit();
        }
        
        // Set and initialize new scene
        this.activeScene = this.scenes.get(name);
        this.activeScene.onEnter();
        return true;
    }
    
    start() {
        if (!this.activeScene) {
            console.error("No active scene set");
            return false;
        }
        
        this.isRunning = true;
        this.lastTime = performance.now();
        requestAnimationFrame(this.gameLoop);
        return true;
    }
    
    stop() {
        this.isRunning = false;
    }
    
    gameLoop(timestamp) {
        if (!this.isRunning) return;
        
        // Calculate delta time
        const deltaTime = (timestamp - this.lastTime) / 1000;
        this.lastTime = timestamp;
        
        // Update systems
        this.input.update();
        this.physics.update(deltaTime);
        
        // Update and render active scene
        if (this.activeScene) {
            this.activeScene.update(deltaTime);
            this.renderer.render(this.activeScene.scene, this.camera);
        }
        
        // Continue loop
        requestAnimationFrame(this.gameLoop);
    }
    
    resize(width, height) {
        this.config.width = width;
        this.config.height = height;
        
        // Update camera
        this.camera.left = -width / 2;
        this.camera.right = width / 2;
        this.camera.top = height / 2;
        this.camera.bottom = -height / 2;
        this.camera.updateProjectionMatrix();
        
        // Update renderer
        this.renderer.setSize(width, height);
    }
} 