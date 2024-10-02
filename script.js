const canvas = document.getElementById('snakeGame');
const ctx = canvas.getContext('2d');

// Set canvas dimensions
canvas.width = 320;
canvas.height = 480;

// Game state
let isGameOver = false;
let isGameStarted = false;

// Snake settings
const snake = {
    body: [{ x: 10, y: 10 }],
    size: 20,
    direction: { x: 1, y: 0 },
    draw() {
        ctx.fillStyle = 'green';
        this.body.forEach(segment => {
            ctx.fillRect(segment.x * this.size, segment.y * this.size, this.size, this.size);
        });
    },
    move() {
        const head = { x: this.body[0].x + this.direction.x, y: this.body[0].y + this.direction.y };
        this.body.unshift(head);
        
        // Check for collision with food
        if (head.x === food.x && head.y === food.y) {
            food.spawn();
        } else {
            this.body.pop();
        }

        // Check for wall collisions
        if (head.x < 0 || head.x >= canvas.width / this.size || head.y < 0 || head.y >= canvas.height / this.size) {
            isGameOver = true;
        }

        // Check for self-collision
        for (let i = 1; i < this.body.length; i++) {
            if (head.x === this.body[i].x && head.y === this.body[i].y) {
                isGameOver = true;
            }
        }
    },
    reset() {
        this.body = [{ x: 10, y: 10 }];
        this.direction = { x: 1, y: 0 };
    }
};

// Food settings
const food = {
    x: 5,
    y: 5,
    spawn() {
        this.x = Math.floor(Math.random() * (canvas.width / snake.size));
        this.y = Math.floor(Math.random() * (canvas.height / snake.size));
    },
    draw() {
        ctx.fillStyle = 'red';
        ctx.fillRect(this.x * snake.size, this.y * snake.size, snake.size, snake.size);
    }
};

// Draw score
function drawScore(score) {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.textAlign = 'left';
    ctx.fillText('Score: ' + (snake.body.length - 1), 10, 30);
}

// Draw start screen
function drawStartScreen() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(40, canvas.height / 2 - 60, 240, 120);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(40, canvas.height / 2 - 60, 240, 120);
    
    ctx.fillStyle = '#000';
    ctx.font = '30px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText('Snake Game', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Click to Start', canvas.width / 2, canvas.height / 2 + 20);
}

// Draw game over screen
function drawGameOverScreen() {
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fillRect(40, canvas.height / 2 - 60, 240, 120);
    ctx.lineWidth = 5;
    ctx.strokeStyle = 'black';
    ctx.strokeRect(40, canvas.height / 2 - 60, 240, 120);
    
    ctx.fillStyle = '#000';
    ctx.font = '30px Comic Sans MS';
    ctx.textAlign = 'center';
    ctx.fillText('Game Over', canvas.width / 2, canvas.height / 2 - 20);
    ctx.fillText('Score: ' + (snake.body.length - 1), canvas.width / 2, canvas.height / 2 + 10);
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 40);
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    if (isGameStarted && !isGameOver) {
        snake.draw();
        snake.move();
        food.draw();
        drawScore(snake.body.length - 1);
    } else if (!isGameStarted) {
        drawStartScreen();
    } else if (isGameOver) {
        drawGameOverScreen();
    }

    requestAnimationFrame(gameLoop);
}

// Start or reset the game on click
canvas.addEventListener('click', function() {
    if (isGameOver) {
        snake.reset();
        food.spawn();
        isGameOver = false;
    } else if (!isGameStarted) {
        isGameStarted = true;
        food.spawn();
    }
});

// Key listener for controlling the snake
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp' && snake.direction.y === 0) {
        snake.direction = { x: 0, y: -1 };
    } else if (event.key === 'ArrowDown' && snake.direction.y === 0) {
        snake.direction = { x: 0, y: 1 };
    } else if (event.key === 'ArrowLeft' && snake.direction.x === 0) {
        snake.direction = { x: -1, y: 0 };
    } else if (event.key === 'ArrowRight' && snake.direction.x === 0) {
        snake.direction = { x: 1, y: 0 };
    }
});

gameLoop();
