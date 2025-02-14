// Game constants
const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;
const GHOST_COUNT = 4;

// Game state
let score = 0;
let lives = 3;
let pacman = null;
let ghosts = [];
let gameLoop = null;
let isInitialized = false;
let canvas = null;
let ctx = null;

// 0 = wall, 1 = dot, 2 = empty
const gameBoard = [
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,0,0,0,2,0,0,2,0,0,0,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [2,2,2,2,2,2,1,2,2,2,0,2,2,2,2,2,2,0,2,2,2,1,2,2,2,2,2,2],
    [0,0,0,0,0,0,1,0,0,2,0,2,2,2,2,2,2,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,2,2,2,2,2,2,2,2,2,0,0,1,0,0,0,0,0,0],
    [0,0,0,0,0,0,1,0,0,2,0,0,0,0,0,0,0,0,2,0,0,1,0,0,0,0,0,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,0,0,0,0,1,0,0,0,0,0,1,0,0,1,0,0,0,0,0,1,0,0,0,0,1,0],
    [0,1,1,1,0,0,1,1,1,1,1,1,1,2,2,1,1,1,1,1,1,1,0,0,1,1,1,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,0,0,1,0,0,1,0,0,1,0,0,0,0,0,0,0,0,1,0,0,1,0,0,1,0,0,0],
    [0,1,1,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,0,0,1,1,1,1,1,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0],
    [0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0],
    [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]
];

class Pacman {
    constructor(ctx) {
        this.ctx = ctx;  // Store context in the instance
        this.x = CELL_SIZE * 14;
        this.y = CELL_SIZE * 23;
        this.direction = 0;
        this.speed = 2;  // Reduced speed for better control
        this.mouthOpen = 0.2;
        this.mouthDir = 0.02;
        this.radius = CELL_SIZE / 2;  // Added explicit radius
    }

    draw() {
        try {
            this.ctx.save();
            
            // Draw Pacman body
            this.ctx.translate(this.x, this.y);
            this.ctx.rotate(this.direction);
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI);
            this.ctx.lineTo(0, 0);
            this.ctx.fillStyle = "yellow";
            this.ctx.fill();
            this.ctx.closePath();
            
            this.ctx.restore();

            // Animate mouth
            this.mouthOpen += this.mouthDir;
            if (this.mouthOpen > 0.3 || this.mouthOpen < 0.05) {
                this.mouthDir *= -1;
            }
        } catch (error) {
            debug(`Error drawing Pacman: ${error.message}`);
            console.error(error);
        }
    }

    move() {
        let nextX = this.x;
        let nextY = this.y;

        if (this.direction === 0) nextX += this.speed;
        if (this.direction === Math.PI) nextX -= this.speed;
        if (this.direction === Math.PI/2) nextY -= this.speed;
        if (this.direction === 3*Math.PI/2) nextY += this.speed;

        // Convert position to grid coordinates
        const gridX = Math.floor(nextX / CELL_SIZE);
        const gridY = Math.floor(nextY / CELL_SIZE);

        // Check if next position is valid (not a wall)
        if (gridX >= 0 && gridX < GRID_WIDTH && gridY >= 0 && gridY < GRID_HEIGHT && 
            gameBoard[gridY] !== undefined && gameBoard[gridY][gridX] !== undefined && gameBoard[gridY][gridX] !== 0) {
            this.x = nextX;
            this.y = nextY;

            // Collect dots
            if (gameBoard[gridY][gridX] === 1) {
                gameBoard[gridY][gridX] = 2;
                score += 10;
                document.getElementById('score').textContent = score;
            }
        }
    }
}

class Ghost {
    constructor(ctx, x, y, color) {
        this.ctx = ctx;
        this.x = x;
        this.y = y;
        this.color = color;
        this.direction = 0;  // Will be set during initialization
        this.speed = 1.5;
        this.radius = CELL_SIZE / 2;
        this.lastDirection = this.direction;
        this.stuckCounter = 0;
    }

    draw() {
        try {
            this.ctx.save();
            
            // Draw Ghost body
            this.ctx.translate(this.x, this.y);
            
            this.ctx.beginPath();
            this.ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = this.color;
            this.ctx.fill();
            this.ctx.closePath();
            
            this.ctx.restore();
        } catch (error) {
            debug(`Error drawing Ghost: ${error.message}`);
            console.error(error);
        }
    }

    move() {
        const currentX = this.x;
        const currentY = this.y;
        
        // Try to move in current direction
        let nextX = this.x;
        let nextY = this.y;

        if (this.direction === 0) nextX += this.speed;
        if (this.direction === Math.PI) nextX -= this.speed;
        if (this.direction === Math.PI/2) nextY -= this.speed;
        if (this.direction === 3*Math.PI/2) nextY += this.speed;

        // Get current and next grid positions
        const currentGridX = Math.floor(this.x / CELL_SIZE);
        const currentGridY = Math.floor(this.y / CELL_SIZE);
        const nextGridX = Math.floor(nextX / CELL_SIZE);
        const nextGridY = Math.floor(nextY / CELL_SIZE);

        // Check if next position is valid
        if (this.isValidPosition(nextGridX, nextGridY)) {
            this.x = nextX;
            this.y = nextY;
            this.stuckCounter = 0;
        } else {
            // If we hit a wall, find a new valid direction
            const availableDirections = this.getAvailableDirections(currentGridX, currentGridY);
            if (availableDirections.length > 0) {
                // Prefer directions that don't lead backwards unless it's the only option
                const forwardDirections = availableDirections.filter(dir => 
                    Math.abs(dir - this.lastDirection) !== Math.PI
                );
                
                if (forwardDirections.length > 0) {
                    this.direction = forwardDirections[Math.floor(Math.random() * forwardDirections.length)];
                } else {
                    this.direction = availableDirections[Math.floor(Math.random() * availableDirections.length)];
                }
            }
            this.stuckCounter++;
        }

        // If ghost is stuck, instead of teleporting to center, 
        // move to nearest valid position
        if (this.stuckCounter > 60) {
            const nearestPath = this.findNearestValidPosition();
            if (nearestPath) {
                this.x = nearestPath.x * CELL_SIZE;
                this.y = nearestPath.y * CELL_SIZE;
                this.direction = Math.floor(Math.random() * 4) * (Math.PI / 2);
            }
            this.stuckCounter = 0;
        }

        this.lastDirection = this.direction;
    }

    isValidPosition(gridX, gridY) {
        return gridX >= 0 && gridX < GRID_WIDTH && 
               gridY >= 0 && gridY < GRID_HEIGHT && 
               gameBoard[gridY] && 
               (gameBoard[gridY][gridX] === 1 || gameBoard[gridY][gridX] === 2);
    }

    getAvailableDirections(gridX, gridY) {
        const directions = [];
        const possibleMoves = [
            { dir: 0, dx: 1, dy: 0 },      // Right
            { dir: Math.PI, dx: -1, dy: 0 }, // Left
            { dir: Math.PI/2, dx: 0, dy: -1 }, // Up
            { dir: 3*Math.PI/2, dx: 0, dy: 1 }  // Down
        ];

        possibleMoves.forEach(move => {
            if (this.isValidPosition(gridX + move.dx, gridY + move.dy)) {
                directions.push(move.dir);
            }
        });

        return directions;
    }

    findNearestValidPosition() {
        const currentX = Math.floor(this.x / CELL_SIZE);
        const currentY = Math.floor(this.y / CELL_SIZE);
        
        // Search in expanding squares around current position
        for (let dist = 1; dist < Math.max(GRID_WIDTH, GRID_HEIGHT); dist++) {
            for (let i = -dist; i <= dist; i++) {
                for (let j = -dist; j <= dist; j++) {
                    const checkX = currentX + i;
                    const checkY = currentY + j;
                    
                    if (this.isValidPosition(checkX, checkY)) {
                        return { x: checkX, y: checkY };
                    }
                }
            }
        }
        return null;
    }
}

function drawBoard(ctx) {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
            if (gameBoard[y] !== undefined && gameBoard[y][x] !== undefined) {
                if (gameBoard[y][x] === 0) {
                    ctx.fillStyle = 'blue';
                    ctx.fillRect(x * CELL_SIZE, y * CELL_SIZE, CELL_SIZE, CELL_SIZE);
                } else if (gameBoard[y][x] === 1) {
                    ctx.beginPath();
                    ctx.arc(x * CELL_SIZE + CELL_SIZE/2, y * CELL_SIZE + CELL_SIZE/2, 
                           3, 0, Math.PI * 2);
                    ctx.fillStyle = 'white';
                    ctx.fill();
                    ctx.closePath();
                }
            } else {
                debug(`Invalid gameBoard access at (${x}, ${y})`);
            }
        }
    }
}

// Debug function
function debug(msg) {
    const debugEl = document.getElementById('debug');
    if (debugEl) {
        debugEl.textContent = msg;
        console.log(msg); // Also log to console for debugging
    }
}

function initGame() {
    try {
        debug('Starting initialization...');
        
        // Get canvas element
        canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        // Get context
        ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        
        // Set canvas dimensions
        canvas.width = GRID_WIDTH * CELL_SIZE;
        canvas.height = GRID_HEIGHT * CELL_SIZE;
        
        // Reset game state
        score = 0;
        lives = 3;
        document.getElementById('score').textContent = '0';
        document.getElementById('lives').textContent = '3';
        
        // Create new Pacman with context
        pacman = new Pacman(ctx);
        
        // Create ghosts with corner starting positions
        ghosts = [];
        const ghostConfigs = [
            { color: 'red', x: 1, y: 1, direction: 0 },                    // Top-left
            { color: 'pink', x: GRID_WIDTH - 2, y: 1, direction: Math.PI }, // Top-right
            { color: 'cyan', x: 1, y: GRID_HEIGHT - 2, direction: 0 },     // Bottom-left
            { color: 'orange', x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2, direction: Math.PI }  // Bottom-right
        ];
        
        for (let config of ghostConfigs) {
            const ghost = new Ghost(
                ctx,
                config.x * CELL_SIZE,
                config.y * CELL_SIZE,
                config.color
            );
            ghost.direction = config.direction;  // Set initial direction
            ghosts.push(ghost);
        }
        
        // Mark as initialized
        isInitialized = true;
        
        // Initial draw
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        drawBoard(ctx);
        pacman.draw();
        ghosts.forEach(ghost => ghost.draw());
        
        debug('Game initialized, starting game loop...');
        
        // Start game loop
        gameLoop = requestAnimationFrame(runGame);
        
    } catch (error) {
        debug(`Error during initialization: ${error.message}`);
        console.error(error);
    }
}

function runGame() {
    if (!isInitialized || !ctx || !canvas) {
        debug('Game not properly initialized, retrying...');
        setTimeout(initGame, 100);
        return;
    }
    
    try {
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw game elements
        drawBoard(ctx);
        
        if (pacman) {
            pacman.move();
            pacman.draw();
        }
        
        let collision = false;
        ghosts.forEach(ghost => {
            ghost.move();
            ghost.draw();
            
            // Improved collision detection
            const dx = ghost.x - pacman.x;
            const dy = ghost.y - pacman.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < CELL_SIZE * 0.8) { // Slightly smaller than cell size for better precision
                collision = true;
            }
        });

        // Handle collision outside the ghost loop
        if (collision) {
            lives--;
            document.getElementById('lives').textContent = lives;
            
            if (lives <= 0) {
                debug('Game Over');
                cancelAnimationFrame(gameLoop);
                alert('Game Over');
                return;
            } else {
                // Reset positions
                pacman.x = CELL_SIZE * 14;
                pacman.y = CELL_SIZE * 23;
                pacman.direction = 0;
                
                // Reset ghosts to their starting positions
                ghosts.forEach((ghost, index) => {
                    const ghostConfigs = [
                        { x: 1, y: 1 },                        // Top-left
                        { x: GRID_WIDTH - 2, y: 1 },          // Top-right
                        { x: 1, y: GRID_HEIGHT - 2 },         // Bottom-left
                        { x: GRID_WIDTH - 2, y: GRID_HEIGHT - 2 }  // Bottom-right
                    ];
                    ghost.x = ghostConfigs[index].x * CELL_SIZE;
                    ghost.y = ghostConfigs[index].y * CELL_SIZE;
                    ghost.direction = Math.floor(Math.random() * 4) * (Math.PI / 2);
                });
                
                debug('Life lost! Remaining lives: ' + lives);
            }
        }
        
        // Continue loop
        gameLoop = requestAnimationFrame(runGame);
    } catch (error) {
        debug(`Error in game loop: ${error.message}`);
        console.error(error);
    }
}

// Key controls
document.addEventListener('keydown', (e) => {
    if (!pacman) return;
    
    switch(e.key) {
        case 'ArrowLeft':
            pacman.direction = Math.PI;
            break;
        case 'ArrowRight':
            pacman.direction = 0;
            break;
        case 'ArrowUp':
            pacman.direction = Math.PI/2;
            break;
        case 'ArrowDown':
            pacman.direction = 3*Math.PI/2;
            break;
    }
    debug(`Key pressed: ${e.key}, new direction: ${pacman.direction}`);
});

// Wait for window to fully load before starting the game
window.addEventListener('load', () => {
    debug('Window loaded, waiting for DOM...');
    setTimeout(initGame, 100);
});
