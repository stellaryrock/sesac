/**
 * Terrain system for 2D RTS game
 * Handles grid-based map, terrain types, and pathfinding
 */
class Terrain {
    constructor(width, height, tileSize = 32) {
        this.width = width;
        this.height = height;
        this.tileSize = tileSize;
        this.tiles = [];
        this.scene = null;
        this.meshes = [];
        
        // Initialize empty terrain
        this.initialize();
    }
    
    initialize() {
        // Create empty grid
        this.tiles = new Array(this.width * this.height);
        
        // Default all tiles to grass
        for (let i = 0; i < this.tiles.length; i++) {
            this.tiles[i] = {
                type: 'grass',
                walkable: true,
                buildable: true,
                resourceType: null,
                resourceAmount: 0,
                x: i % this.width,
                y: Math.floor(i / this.width)
            };
        }
    }
    
    setScene(scene) {
        this.scene = scene;
    }
    
    // Get tile at grid coordinates
    getTile(x, y) {
        if (x < 0 || x >= this.width || y < 0 || y >= this.height) {
            return null;
        }
        return this.tiles[y * this.width + x];
    }
    
    // Set tile type
    setTileType(x, y, type, walkable = true, buildable = true) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.type = type;
            tile.walkable = walkable;
            tile.buildable = buildable;
            this.updateTileMesh(x, y);
        }
    }
    
    // Add resource to tile
    addResource(x, y, type, amount) {
        const tile = this.getTile(x, y);
        if (tile) {
            tile.resourceType = type;
            tile.resourceAmount = amount;
            tile.buildable = false;
            this.updateTileMesh(x, y);
        }
    }
    
    // Convert grid coordinates to world position
    gridToWorld(x, y) {
        return {
            x: (x - this.width / 2) * this.tileSize,
            y: (y - this.height / 2) * this.tileSize
        };
    }
    
    // Convert world position to grid coordinates
    worldToGrid(x, y) {
        return {
            x: Math.floor(x / this.tileSize + this.width / 2),
            y: Math.floor(y / this.tileSize + this.height / 2)
        };
    }
    
    // Check if position is walkable
    isWalkable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.walkable;
    }
    
    // Check if position is buildable
    isBuildable(x, y) {
        const tile = this.getTile(x, y);
        return tile && tile.buildable;
    }
    
    // Render the terrain
    render() {
        if (!this.scene) return;
        
        // Clear existing meshes
        for (const mesh of this.meshes) {
            this.scene.remove(mesh);
        }
        this.meshes = [];
        
        // Create new meshes for each tile
        for (let y = 0; y < this.height; y++) {
            for (let x = 0; x < this.width; x++) {
                this.createTileMesh(x, y);
            }
        }
    }
    
    // Create mesh for a single tile
    createTileMesh(x, y) {
        const tile = this.getTile(x, y);
        if (!tile) return;
        
        const pos = this.gridToWorld(x, y);
        const geometry = new THREE.PlaneGeometry(this.tileSize, this.tileSize);
        
        // Choose color based on tile type
        let color;
        switch (tile.type) {
            case 'grass': color = 0x7cfc00; break;
            case 'water': color = 0x1e90ff; break;
            case 'mountain': color = 0x808080; break;
            case 'sand': color = 0xf4a460; break;
            default: color = 0x7cfc00;
        }
        
        const material = new THREE.MeshBasicMaterial({ color });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(pos.x, pos.y, 0);
        
        // Add resource indicator if present
        if (tile.resourceType) {
            const resourceGeometry = new THREE.CircleGeometry(this.tileSize / 4, 16);
            let resourceColor;
            
            switch (tile.resourceType) {
                case 'gold': resourceColor = 0xffd700; break;
                case 'wood': resourceColor = 0x8b4513; break;
                case 'stone': resourceColor = 0x696969; break;
                default: resourceColor = 0xffffff;
            }
            
            const resourceMaterial = new THREE.MeshBasicMaterial({ color: resourceColor });
            const resourceMesh = new THREE.Mesh(resourceGeometry, resourceMaterial);
            resourceMesh.position.set(pos.x, pos.y, 0.1);
            
            this.scene.add(resourceMesh);
            this.meshes.push(resourceMesh);
        }
        
        this.scene.add(mesh);
        this.meshes.push(mesh);
        
        return mesh;
    }
    
    // Update a single tile mesh
    updateTileMesh(x, y) {
        // For simplicity, just re-render the whole terrain
        // In a real game, you'd want to update just the specific tile
        this.render();
    }
    
    // Simple A* pathfinding
    findPath(startX, startY, endX, endY) {
        // Implementation of A* pathfinding algorithm
        // This is a simplified version - a real game would need a more robust implementation
        
        // Check if start and end are valid
        if (!this.isWalkable(startX, startY) || !this.isWalkable(endX, endY)) {
            return null;
        }
        
        // If start and end are the same, return empty path
        if (startX === endX && startY === endY) {
            return [];
        }
        
        // A* algorithm would go here
        // For this boilerplate, we'll just return a direct path
        return [
            { x: startX, y: startY },
            { x: endX, y: endY }
        ];
    }
}

export default Terrain; 