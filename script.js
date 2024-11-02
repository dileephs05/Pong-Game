const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    radius: 10,
    dx: 4 * (Math.random() > 0.5 ? 1 : -1),
    dy: 4 * (Math.random() > 0.5 ? 1 : -1),
};

// Paddles
const paddleWidth = 10;
const paddleHeight = 100;
const player1Paddle = { x: 10, y: canvas.height / 2 - paddleHeight / 2, dy: 5 };
const player2Paddle = { x: canvas.width - paddleWidth - 10, y: canvas.height / 2 - paddleHeight / 2, dy: 5 };

// Player controls
const keys = {
    w: false,
    s: false,
    ArrowUp: false,
    ArrowDown: false
};

// Game state
let gameState = 'START'; // Possible states: 'START', 'PLAYING', 'GAME_OVER'
let player1Score = 0;
let player2Score = 0;

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
    if (e.key in keys) keys[e.key] = true;
});
document.addEventListener('keyup', (e) => {
    if (e.key in keys) keys[e.key] = false;
});

// Start button event listener
document.getElementById('startButton').addEventListener('click', () => {
    if (gameState === 'START' || gameState === 'GAME_OVER') {
        gameState = 'PLAYING';
        resetGame();
        document.getElementById('winnerMessage').style.display = 'none'; // Hide winner message
        gameLoop(); // Start the game loop
    }
});

// Function to draw the ball
function drawBall() {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.closePath();
}

// Function to draw paddles
function drawPaddle(paddle) {
    ctx.fillStyle = '#fff';
    ctx.fillRect(paddle.x, paddle.y, paddleWidth, paddleHeight);
}

// Function to draw scores
function drawScores() {
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText(`Player 1: ${player1Score}`, 50, 30);
    ctx.fillText(`Player 2: ${player2Score}`, canvas.width - 150, 30);
}

// Function to move paddles
function movePaddles() {
    // Player 1 (Left Paddle) controls
        if (keys.w && player1Paddle.y > 0) {
        player1Paddle.y -= player1Paddle.dy;
    }
    if (keys.s && player1Paddle.y < canvas.height - paddleHeight) {
        player1Paddle.y += player1Paddle.dy;
    }

    // Player 2 (Right Paddle) controls
    if (keys.ArrowUp && player2Paddle.y > 0) {
        player2Paddle.y -= player2Paddle.dy;
    }
    if (keys.ArrowDown && player2Paddle.y < canvas.height - paddleHeight) {
        player2Paddle.y += player2Paddle.dy;
    }
}

// Function to move the ball
function moveBall() {
    ball.x += ball.dx;
    ball.y += ball.dy;

    // Ball collision with top and bottom walls
    if (ball.y + ball.radius > canvas.height || ball.y - ball.radius < 0) {
        ball.dy *= -1;
    }

    // Ball collision with player 1 paddle
    if (ball.x - ball.radius < player1Paddle.x + paddleWidth &&
        ball.y > player1Paddle.y && ball.y < player1Paddle.y + paddleHeight) {
        ball.dx *= -1; // Reverse ball direction
        ball.dx *= 1.2; // Increase speed
        ball.dy *= 1.2; // Optionally, increase vertical speed as well
    }

    // Ball collision with player 2 paddle
    if (ball.x + ball.radius > player2Paddle.x &&
        ball.y > player2Paddle.y && ball.y < player2Paddle.y + paddleHeight) {
        ball.dx *= -1; // Reverse ball direction
        ball.dx *= 1.2; // Increase speed
        ball.dy *= 1.2; // Optionally, increase vertical speed as well
    }

    // Ball goes out of bounds (left side)
    if (ball.x + ball.radius < 0) {
        player2Score++;
        checkWinner();
        resetBall();
    }

    // Ball goes out of bounds (right side)
    if (ball.x - ball.radius > canvas.width) {
        player1Score++;
        checkWinner();
        resetBall();
    }
}

// Function to check if there is a winner
function checkWinner() {
    if (player1Score === 3) {
        gameState = 'GAME_OVER';
        document.getElementById('winnerMessage').innerText = 'Player 1 Wins!';
        document.getElementById('winnerMessage').style.display = 'block'; // Show winner message
    } else if (player2Score === 3) {
        gameState = 'GAME_OVER';
        document.getElementById('winnerMessage').innerText = 'Player 2 Wins!';
        document.getElementById('winnerMessage').style.display = 'block'; // Show winner message
    }
}

// Function to reset the ball to the center
function resetBall() {
    ball.x = canvas.width / 2;
    ball.y = canvas.height / 2;
    ball.dx = 4 * (Math.random() > 0.5 ? 1 : -1);
    ball.dy = 4 * (Math.random() > 0.5 ? 1 : -1);
}

// Function to reset the game
function resetGame() {
    player1Score = 0;
    player2Score = 0;
    resetBall();
}

// Main game loop
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas
    drawBall();
    drawPaddle(player1Paddle);
    drawPaddle(player2Paddle);
    drawScores();
    movePaddles();
    moveBall();

    if (gameState === 'PLAYING') {
        requestAnimationFrame(gameLoop); // Continue the game loop
    }
}