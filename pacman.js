const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const CELL_SIZE = 16;
const PACMAN_SIZE = CELL_SIZE * 1.5;

class Pacman {
    constructor() {
        this.x = CELL_SIZE * 14;
        this.y = CELL_SIZE * 23;
        this.direction = 0;
        this.speed = 2;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, PACMAN_SIZE/2, 0.2 * Math.PI + this.direction, 1.8 * Math.PI + this.direction);
        ctx.lineTo(this.x, this.y);
        ctx.fillStyle = "yellow";
        ctx.fill();
        ctx.closePath();
    }

    move() {
        if (this.direction === 0) this.x += this.speed;
        if (this.direction === Math.PI) this.x -= this.speed;
        if (this.direction === Math.PI/2) this.y -= this.speed;
        if (this.direction === 3*Math.PI/2) this.y += this.speed;
    }
}

let pacman = new Pacman();
let score = 0;

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
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pacman.move();
    pacman.draw();
    requestAnimationFrame(gameLoop);
}

gameLoop();
