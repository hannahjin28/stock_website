const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 20;
const GRID_WIDTH = 28;
const GRID_HEIGHT = 31;

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
    constructor() {
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
            ctx.save();
            
            // Draw Pacman body
            ctx.translate(this.x, this.y);
            ctx.rotate(this.direction);
            
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI);
            ctx.lineTo(0, 0);
            ctx.fillStyle = "yellow";
            ctx.fill();
            ctx.closePath();
            
            ctx.restore();

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
            gameBoard[gridY][gridX] !== 0) {
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

function drawBoard() {
    for (let y = 0; y < GRID_HEIGHT; y++) {
        for (let x = 0; x < GRID_WIDTH; x++) {
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
        }
    }
}

// Game state and initialization flags
let score = 0;
let pacman = null;
let gameLoop = null;
let isInitialized = false;

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
        const canvas = document.getElementById('gameCanvas');
        if (!canvas) {
            throw new Error('Canvas element not found');
        }
        
        // Get context
        const ctx = canvas.getContext('2d');
        if (!ctx) {
            throw new Error('Could not get canvas context');
        }
        
        // Reset game state
        score = 0;
        document.getElementById('score').textContent = '0';
        
        // Set canvas dimensions
        canvas.width = GRID_WIDTH * CELL_SIZE;
        canvas.height = GRID_HEIGHT * CELL_SIZE;
        
        // Create new Pacman
        pacman = new Pacman();
        
        // Mark as initialized
        isInitialized = true;
        
        debug('Game initialized, starting game loop...');
        
        // Initial draw
        drawBoard();
        pacman.draw();
        
        // Start game loop
        gameLoop = requestAnimationFrame(runGame);
        
    } catch (error) {
        debug(`Error during initialization: ${error.message}`);
        console.error(error);
    }
}

function runGame() {
    if (!isInitialized) {
        debug('Game not properly initialized, retrying...');
        setTimeout(initGame, 100);
        return;
    }
    
    try {
        const canvas = document.getElementById('gameCanvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Draw game elements
        drawBoard();
        
        if (pacman) {
            pacman.move();
            pacman.draw();
            debug(`Pacman at: (${Math.round(pacman.x)}, ${Math.round(pacman.y)})`);
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
