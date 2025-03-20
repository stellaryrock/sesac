/**
 * Main Menu Scene
 */
class MainMenuScene extends Scene {
    constructor() {
        super('mainMenu');
        
        // Add title text
        this.title = new Sprite({
            width: 400,
            height: 100,
            color: 0x3498db,
            position: { x: 0, y: -100 },
            name: 'title'
        });
        
        this.add(this.title);
        
        // Add start button
        this.startButton = new Sprite({
            width: 200,
            height: 50,
            color: 0x2ecc71,
            position: { x: 0, y: 50 },
            name: 'startButton'
        });
        
        this.add(this.startButton);
    }
    
    onEnter() {
        console.log('Entered main menu scene');
    }
    
    update(deltaTime) {
        super.update(deltaTime);
        
        // Animate title
        this.title.rotation += deltaTime * 0.2;
        
        // Check for button click
        if (this.engine && this.engine.input.isMouseButtonDown('left')) {
            const mousePos = this.engine.input.getWorldMousePosition(this.engine.camera);
            
            if (Utils.pointInRect(
                mousePos.x, mousePos.y,
                this.startButton.position.x - this.startButton.width / 2,
                this.startButton.position.y - this.startButton.height / 2,
                this.startButton.width,
                this.startButton.height
            )) {
                // Start game when button is clicked
                if (typeof window.startGame === 'function') {
                    window.startGame();
                }
            }
        }
    }
}

// Export the scene class
export default MainMenuScene; 