/**
 * Utility functions for the game engine
 */
const Utils = {
    /**
     * Generate a random integer between min and max (inclusive)
     */
    randomInt: function(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    },
    
    /**
     * Generate a random float between min and max
     */
    randomFloat: function(min, max) {
        return Math.random() * (max - min) + min;
    },
    
    /**
     * Calculate distance between two points
     */
    distance: function(x1, y1, x2, y2) {
        const dx = x2 - x1;
        const dy = y2 - y1;
        return Math.sqrt(dx * dx + dy * dy);
    },
    
    /**
     * Linear interpolation
     */
    lerp: function(a, b, t) {
        return a + (b - a) * t;
    },
    
    /**
     * Clamp a value between min and max
     */
    clamp: function(value, min, max) {
        return Math.max(min, Math.min(max, value));
    },
    
    /**
     * Convert degrees to radians
     */
    degToRad: function(degrees) {
        return degrees * Math.PI / 180;
    },
    
    /**
     * Convert radians to degrees
     */
    radToDeg: function(radians) {
        return radians * 180 / Math.PI;
    },
    
    /**
     * Check if a point is inside a rectangle
     */
    pointInRect: function(px, py, rx, ry, rw, rh) {
        return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
    },
    
    /**
     * Load an image and return a promise
     */
    loadImage: function(src) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },
    
    /**
     * Load a sound and return a promise
     */
    loadSound: function(src) {
        return new Promise((resolve, reject) => {
            const audio = new Audio();
            audio.oncanplaythrough = () => resolve(audio);
            audio.onerror = reject;
            audio.src = src;
        });
    },
    
    /**
     * Create a sprite sheet animation
     */
    createAnimation: function(texture, frameWidth, frameHeight, frameCount, frameRate) {
        const frames = [];
        
        for (let i = 0; i < frameCount; i++) {
            const u = (i % (texture.image.width / frameWidth)) * frameWidth / texture.image.width;
            const v = Math.floor(i / (texture.image.width / frameWidth)) * frameHeight / texture.image.height;
            
            const frame = texture.clone();
            frame.offset.x = u;
            frame.offset.y = v;
            frame.repeat.x = frameWidth / texture.image.width;
            frame.repeat.y = frameHeight / texture.image.height;
            
            frames.push(frame);
        }
        
        return {
            frames,
            frameRate,
            currentFrame: 0,
            elapsed: 0,
            
            update: function(deltaTime) {
                this.elapsed += deltaTime;
                
                if (this.elapsed >= 1 / this.frameRate) {
                    this.currentFrame = (this.currentFrame + 1) % this.frames.length;
                    this.elapsed = 0;
                    
                    return this.frames[this.currentFrame];
                }
                
                return null;
            },
            
            reset: function() {
                this.currentFrame = 0;
                this.elapsed = 0;
            }
        };
    }
}; 