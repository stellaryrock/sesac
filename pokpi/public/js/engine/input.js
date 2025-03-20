/**
 * Input Manager
 * Handles keyboard, mouse, and touch input
 */
class InputManager {
    constructor(domElement) {
        this.keys = {};
        this.mousePosition = { x: 0, y: 0 };
        this.mouseButtons = { left: false, middle: false, right: false };
        this.domElement = domElement;
        
        // Set up event listeners
        this.setupKeyboardEvents();
        this.setupMouseEvents();
        this.setupTouchEvents();
    }
    
    setupKeyboardEvents() {
        window.addEventListener('keydown', (e) => {
            this.keys[e.code] = true;
        });
        
        window.addEventListener('keyup', (e) => {
            this.keys[e.code] = false;
        });
        
        // Prevent default behavior for game keys
        window.addEventListener('keydown', (e) => {
            // Prevent scrolling with arrow keys, space, etc.
            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'Space'].includes(e.code)) {
                e.preventDefault();
            }
        });
    }
    
    setupMouseEvents() {
        this.domElement.addEventListener('mousemove', (e) => {
            const rect = this.domElement.getBoundingClientRect();
            this.mousePosition.x = e.clientX - rect.left;
            this.mousePosition.y = e.clientY - rect.top;
        });
        
        this.domElement.addEventListener('mousedown', (e) => {
            switch (e.button) {
                case 0: this.mouseButtons.left = true; break;
                case 1: this.mouseButtons.middle = true; break;
                case 2: this.mouseButtons.right = true; break;
            }
        });
        
        this.domElement.addEventListener('mouseup', (e) => {
            switch (e.button) {
                case 0: this.mouseButtons.left = false; break;
                case 1: this.mouseButtons.middle = false; break;
                case 2: this.mouseButtons.right = false; break;
            }
        });
        
        // Prevent context menu on right click
        this.domElement.addEventListener('contextmenu', (e) => {
            e.preventDefault();
        });
    }
    
    setupTouchEvents() {
        this.domElement.addEventListener('touchstart', (e) => {
            const touch = e.touches[0];
            const rect = this.domElement.getBoundingClientRect();
            this.mousePosition.x = touch.clientX - rect.left;
            this.mousePosition.y = touch.clientY - rect.top;
            this.mouseButtons.left = true;
        });
        
        this.domElement.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            const rect = this.domElement.getBoundingClientRect();
            this.mousePosition.x = touch.clientX - rect.left;
            this.mousePosition.y = touch.clientY - rect.top;
        });
        
        this.domElement.addEventListener('touchend', () => {
            this.mouseButtons.left = false;
        });
    }
    
    isKeyDown(keyCode) {
        return this.keys[keyCode] === true;
    }
    
    isMouseButtonDown(button) {
        return this.mouseButtons[button] === true;
    }
    
    getMousePosition() {
        return { ...this.mousePosition };
    }
    
    // Convert screen coordinates to world coordinates
    getWorldMousePosition(camera) {
        const x = (this.mousePosition.x / this.domElement.width) * 2 - 1;
        const y = -(this.mousePosition.y / this.domElement.height) * 2 + 1;
        
        const vector = new THREE.Vector3(x, y, 0);
        vector.unproject(camera);
        
        return vector;
    }
    
    update() {
        // This method can be used for any per-frame input processing
    }
} 