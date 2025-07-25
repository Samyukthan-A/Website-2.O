// bottom-game.js

const canvas = document.getElementById('bottom-game-canvas');
const ctx = canvas.getContext('2d');

// -- Responsive sizing --
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = 90;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// -- Game variables --
let paddle = { x: canvas.width/2 - 50, width: 100, height: 15 };
let ball = { x: Math.random() * (canvas.width-20)+10, y: 0, radius: 12, speed: 2 };
let score = 0;

function resetBall() {
  ball.x = Math.random() * (canvas.width - 24) + 12;
  ball.y = -20;
  ball.speed = 2 + Math.random()*2 + score*0.2;
}

function draw() {
  // Clear
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Paddle
  ctx.fillStyle = "#59caf5";
  ctx.fillRect(paddle.x, canvas.height - paddle.height - 8, paddle.width, paddle.height);
  
  // Ball (falling object)
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, 2*Math.PI);
  ctx.fillStyle = "#ffda5a";
  ctx.fill();
  ctx.strokeStyle = "#b19023";
  ctx.stroke();

  // Score
  ctx.font = "18px monospace";
  ctx.fillStyle = "#fff";
  ctx.fillText("Score: " + score, 20, 30);
}

function update() {
  // Ball movement
  ball.y += ball.speed;
  
  // Collision with paddle
  if (
    ball.y + ball.radius >= canvas.height - paddle.height - 8 && 
    ball.x > paddle.x && 
    ball.x < paddle.x + paddle.width
  ) {
    score++;
    resetBall();
  }
  // Ball missed
  if (ball.y - ball.radius > canvas.height) {
    score = 0;
    resetBall();
  }
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}
gameLoop();

// -- Controls --
document.addEventListener('keydown', function(e) {
  if (e.key === "ArrowLeft") paddle.x -= 32;
  if (e.key === "ArrowRight") paddle.x += 32;
  if (paddle.x < 0) paddle.x = 0;
  if (paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
});

// -- Touch Controls --
let touchStart = null;
canvas.addEventListener('touchstart', (e) => {
  if (e.touches.length) touchStart = e.touches[0].clientX;
});
canvas.addEventListener('touchmove', (e) => {
  if (e.touches.length && touchStart !== null) {
    let dx = e.touches[0].clientX - touchStart;
    paddle.x += dx;
    if (paddle.x < 0) paddle.x = 0;
    if (paddle.x > canvas.width - paddle.width) paddle.x = canvas.width - paddle.width;
    touchStart = e.touches[0].clientX;
  }
});
canvas.addEventListener('touchend', () => { touchStart = null; });

// -- Re-center paddle on window resize --
window.addEventListener('resize', () => {
  paddle.x = canvas.width/2 - paddle.width/2;
});
