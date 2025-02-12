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
        // Save the current context state
        ctx.save();
        
        // Move to Pac-Man's position
        ctx.translate(this.x, this.y);
        ctx.rotate(this.direction);
        
        // Draw Pac-Man
        ctx.beginPath();
        ctx.arc(0, 0, this.radius, this.mouthOpen * Math.PI, (2 - this.mouthOpen) * Math.PI);
        ctx.lineTo(0, 0);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
        
        // Restore the context state
        ctx.restore();

        // Animate mouth
        this.mouthOpen += this.mouthDir;
        if (this.mouthOpen > 0.3 || this.mouthOpen < 0.05) {
            this.mouthDir *= -1;
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

document.addEventListener('keydown', (e) => {
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
});

function gameLoop() {
    // Clear the entire canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw game elements
    drawBoard();
    pacman.move();
    pacman.draw();
    
    requestAnimationFrame(gameLoop);
}

// Initialize canvas dimensions and game
canvas.width = GRID_WIDTH * CELL_SIZE;
canvas.height = GRID_HEIGHT * CELL_SIZE;
let score = 0;
let pacman = new Pacman();

// Start the game loop
gameLoop();
